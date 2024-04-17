import { db_getUserByJWT } from "../db/db_users.js";
import { unzipJWT } from "../db/db_users.js";




const connectedUsers = []


export function ws(io){


  io.on('connection',async (socket) => {
  
    const token = socket.handshake.auth?.token
    


    const user = await getUser(token,socket)



    console.log('a user connected',user.username);
    
    socket.on('disconnect', () => {
      console.log('user disconnected',user.username);
      const index = connectedUsers.findIndex(u => u.id === user.id);
      if (index !== -1) {
        connectedUsers.splice(index, 1);
      }
    });
  
    socket.on('chat message', (data) => {
      const {msg} = data
      io.emit('chat message', msg);
      console.log(msg)
    });
  });

  
}



async function getUser(token,socket){

  if (!token) {
    socket.disconnect(true);
    return;
  }

  try{
    const userData = unzipJWT(token)
    const userAlready = connectedUsers.find(x=>x.id === userData.usr_id)

    if(userAlready) return userAlready

    const user = await db_getUserByJWT(token)
    connectedUsers.push(user)

    if(!user){
      socket.disconnect(true); // user not found
      return;
    }

    return user
  }catch{
    socket.disconnect(true); // token expired
    return;
  }

}




export function isUserOnline(user){
  return connectedUsers.some(x=>x.id === user.id)
}