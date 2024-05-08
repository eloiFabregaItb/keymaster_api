import { SOCKET_EVENTS } from "../ws/ws.js"



export class Game{
  constructor(creator,code){
    this.creator = creator
    this.code = code// generateAlphanumeric
    this.users = [ creator ]
    this.recluting = true
    this.playing=false
    this.bans = []

    //this.users.push(creator)

  }

  join(user){
    if(!this.recluting){
      return {success:false, evt:SOCKET_EVENTS.GAME_NOT_RECLUTING, msg:"Las inscripciones de esta partida se han cerrado"}
    }

    if(this.users.some(x=>x.id===user.id)){
      return {success:false, evt:SOCKET_EVENTS.GAME_ALREADY_JOINED, msg:"Ya estas en la partida"}
    }

    if(this.bans.some(x=>x.id===user.id)){
      return {success:false, evt:SOCKET_EVENTS.GAME_USER_BANNED, msg:"No puedes acceder a esta partida. El creador te ha echado"}
    }
      
    this.users.push(user)
    
    for (const u of this.users) {
      if(u.id !== user.id){
        console.log("sending status to",u.username)
        u.socket.emit(SOCKET_EVENTS.GAME_USER_JOINED,{users:this.users.map(x=>x.publicData())})
      }
    }
    

    return {success:true, evt:SOCKET_EVENTS.GAME_USER_JOINED, users:this.users.map(x=>x.publicData())}
  }


  checkCode(code){
    return this.code === code
  }
}