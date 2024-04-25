import { createNewGame, joinGame } from "../controllers/gamesController.js"
import { SOCKET_EVENTS } from "./ws.js"





export function ws_game(io,socket,user){



  socket.on(SOCKET_EVENTS.NEW_GAME, ()=>{
    createNewGame(user,socket)
  })


  socket.on(SOCKET_EVENTS.JOIN_GAME,({code})=>{
    joinGame(user,socket,code)
  })




}