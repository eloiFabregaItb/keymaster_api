export function ws_test(io, socket, user){


  socket.on('chat message', (data) => {
    const {msg} = data
    io.emit('chat message', msg);
    console.log("MSG",msg)
  });


  socket.on('test', (data) => {
    const {msg} = data
    socket.emit('test', {msg:msg+"more"});
    socket.emit("WELCOME",{user:user.publicData()})
    console.log("TEST MSG",msg)
  });


}