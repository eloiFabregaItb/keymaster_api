import { Game } from "../models/Game.js"
import { CHARSET_UPPER, generateAlphaNumericNonRepeated } from "../utils/crypto.js"
import { SOCKET_EVENTS } from "../ws/ws.js"

const games = []


export function createNewGame(creator,socket){
  const code = generateAlphaNumericNonRepeated(6,games,g=>g.code,5, CHARSET_UPPER)
  
  const g = new Game(creator,code)
  games.push(g)

  socket.emit(SOCKET_EVENTS.GAME_CREATED,{code})

  console.log(creator.username,"CREATED",code)
  
  return code
}


export function findGame(code){
  const g = games.find(x=>x.checkCode(code))
  return g
}

export function joinGame(user,socket,code){
  const game = findGame(code)

  
  if(!game){
    console.log("NO GAME")
    socket.emit(SOCKET_EVENTS.GAME_NOT_FOUND,{code,msg:"No se ha encontrado ningun juego con ese código"})
    return
  }

  console.log(user.username,"joining",game.code)
  const data = game.join(user)
  socket.emit(data.evt || SOCKET_EVENTS.GENERAL_ERROR,data)
}


