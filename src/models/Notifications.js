import { BACKEND_URL } from "../constants.js"
import { db_getUserByID } from "../db/db_users.js"

export const NOTIFICATIONS_TYPES = {
  FOLLOW:"FOLLOW"
}

export class Notification{
  constructor({
    notification_id,
    user_id,
    type,
    extra,
    created_at,
    seen,
    target
  }){
    this.id = notification_id
    this.userId = user_id
    this.type = type
    this.extra = extra
    this.target = target
    this.createdAt = created_at
    this.seen = Boolean(seen)

  }

  async init(){

    if(this.type === NOTIFICATIONS_TYPES.FOLLOW) {
      const targetUser = await db_getUserByID(this.target)
      this.target = targetUser.publicData()

      this.msg = targetUser.username + " te ha empezado a seguir"

      this.action = new NotificationAction("Seguir",`${BACKEND_URL}/user/follow?follow=${targetUser.username}`,true)
      
    }

  }


  publicData(){
    const result = {}

    if(this.target){
      result.target=this.target
    }


    if(this.msg){
      result.msg=this.msg
    }


    if(this.action){
      result.action=this.action.publicData()
    }

    return result
  }
}




class NotificationAction{
  constructor(name,url,requireToken=false){
    this.name=name,
    this.url = url
    this.requireToken = requireToken
  }

  publicData(){
    const result = {
      name:this.name,
      url:this.url,
      requireToken:this.requireToken
    }
    return result
  } 
}