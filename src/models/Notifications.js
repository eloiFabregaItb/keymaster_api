import { BACKEND_URL } from "../constants.js"
import { db_getUserByID } from "../db/db_users.js"

export const NOTIFICATIONS_TYPES = {
  FOLLOW:"FOLLOW",
  EMAIL_NO_VERIFIED:"EMAIL_NO_VERIFIED"
}

export class Notification{
  constructor({
    notification_id,
    user_id,
    type,
    extra,
    created_at,
    seen,
    target,
    warn
  }){
    this.userId = user_id
    this.type = type

    //optional
    this.id = notification_id //optional
    this.extra = extra//optional
    this.target = target//optional
    this.createdAt = created_at//optional
    this.seen = Boolean(seen)
    this.warn = Boolean(warn)

    //extra optional
    this.target // usuario
    this.msg
    this.actions=[]//<NotificationAction>
  }

  async init(){

    if(this.type === NOTIFICATIONS_TYPES.FOLLOW) {
      const targetUser = await db_getUserByID(this.target)

      if(!targetUser) return

      this.target = targetUser.publicData()

      if(!this.target) return

      this.msg = targetUser.username + " te ha empezado a seguir"

      this.actions.push(new NotificationAction("Seguir",`${BACKEND_URL}/user/follow?follow=${targetUser.username}`,true))
      
    }else if(this.type === NOTIFICATIONS_TYPES.EMAIL_NO_VERIFIED){
      this.msg = "Tu correo no está verificado."
      this.actions.push( new NotificationAction("Solicitar correo",`${BACKEND_URL}/auth/requestvalidation`,true) )
    }

  }


  publicData(){
    const result = {
      id:this.id,
      type:this.type,
      warn:this.warn,
      actions:this.actions.map(x=>x.publicData()),
      date:this.createdAt
    }

    if(this.target){
      result.target=this.target
    }

    if(this.msg){
      result.msg=this.msg
    }

    return result
  }
}




class NotificationAction{
  constructor(name,url,requireToken=false,isRed=false){
    this.name=name,
    this.url = url
    this.requireToken = requireToken
    this.isRed = isRed
  }

  publicData(){
    const result = {
      name:this.name,
      url:this.url,
      requireToken:this.requireToken,
      isRed:this.isRed
    }
    return result
  } 
}