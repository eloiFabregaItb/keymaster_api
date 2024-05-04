import { createNewGame } from "../controllers/gamesController.js";
import { db_getUserByJWT } from "../db/db_users.js";
import { unzipJWT } from "../db/db_users.js";
import { getCommonElements, getNonDuplicatedElements } from "../utils/array.js";
import { ws_game } from "./ws_game.js";
import { ws_test } from "./ws_test.js";




const connectedSockets = new Map()
const disconnectTimers = new Map() //debounced 3s

export const SOCKET_EVENTS = {
  //listening
  NEW_GAME : "NEW_GAME",
  JOIN_GAME:"JOIN_GAME",
  
  //SIGNALS
  WELCOME:"WELCOME",
  LOGIN:"LOGIN",
  LOGOUT:"LOGOUT",

  //success
  GAME_CREATED:"GAME_CREATED",
  GAME_USER_JOINED:"GAME_USER_JOINED",

  //errors
  GENERAL_ERROR:"GENERAL_ERROR",
  GAME_NOT_FOUND:"GAME_NOT_FOUND",
  GAME_NOT_RECLUTING:"GAME_NOT_RECLUTING",
  GAME_ALREADY_JOINED:"GAME_ALREADY_JOINED",
  GAME_USER_BANNED:"GAME_USER_BANNED",
}


export function ws(io){


  io.on('connection',async (socket) => {
  
    const token = socket.handshake.auth?.token

    let user
    try{
      user = await getUser(token)
    }catch{
      socket.disconnect(true)
      return
    }

    user.setSocket(socket)
    connectedSockets.set(user.id,user)
    
    console.log('WS connected',user.username);
    socket.emit(SOCKET_EVENTS.WELCOME,{user:user.username})
    
    if (disconnectTimers.has(user.id)) {
      clearTimeout(disconnectTimers.get(user.id)); // Clear the existing timer
    }else{
      notifyFriendsOfMyLogin(user)

    }

    // --------------- DISCONNECT ----------------------
    socket.on('disconnect', () => {
      

      
      // Set a new timer to wait for 3 seconds before finalizing the disconnection
      const disconnectTimer = setTimeout(() => {
        console.log('WS disconnected',user.username);
        notifyFriendsOfMyLogout(user);
        connectedSockets.delete(user.id); // Remove the user from the map
        disconnectTimers.delete(user.id); // Clean up the timer from the map
      }, 3000); // 3 seconds timeout

      // Store the timer in the map
      disconnectTimers.set(user.id, disconnectTimer);

    });
  



    // WS endpoints
    ws_test(io,socket,user)
    ws_game(io,socket,user)

  });

  
}


//recuperar usuario a partir del token cuando se hace la conexi
async function getUser(token){

  if (!token) throw new Error("Missing token")

  const userData = unzipJWT(token)
  const userAlreadyIn = connectedSockets.get(userData.usr_id)

  if(userAlreadyIn) return userAlreadyIn

  const user = await db_getUserByJWT(token)
  
  if(!user) throw new Error("No user found")

  await user.getFollowers()
  await user.getFriends()

  return user
}



//returns if a user is in the connected page
export function isUserOnline(user){
  return Boolean(connectedSockets.get(user.id))
}

//sends a event to a user
export function sendMessageToUser(id, event, data) {
  const user = connectedSockets.get(id);
  if(!user) return
  if (user.socket) {
    user.socket.emit(event,data); 
    return true
  }
  return false
}

//notifys my friends when i log in
export function notifyFriendsOfMyLogin(user){
  const connectedUsers = Array.from(connectedSockets,([_,user])=>user)
  const allUsers = getNonDuplicatedElements(user.friends,user.followers,(a,b)=>a.id === b.id)
  const usersToNotify = getCommonElements(allUsers,connectedUsers,(a,b)=>a.id===b.id)

  usersToNotify.forEach((friend) => {
    sendMessageToUser(friend.id, SOCKET_EVENTS.LOGIN, {user:user.publicData()}); 
  });


}

//notify my friends when i logout
export function notifyFriendsOfMyLogout(user){
  const connectedUsers = Array.from(connectedSockets,([_,user])=>user)
  const allUsers = getNonDuplicatedElements(user.friends,user.followers,(a,b)=>a.id === b.id)
  const usersToNotify = getCommonElements(allUsers,connectedUsers,(a,b)=>a.id===b.id)

  usersToNotify.forEach((friend) => {
    sendMessageToUser(friend.id, SOCKET_EVENTS.LOGOUT, {user:user.publicData()}); 
  });


}