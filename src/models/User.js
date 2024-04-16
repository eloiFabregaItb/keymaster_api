import { BACKEND_URL } from "../constants.js"
import { jwtSign } from "../utils/jwt.js"
import {db_getFriends} from "../db/db_friendships.js"
import {db_getNotifications} from "../db/db_notifications.js"


export class User {
  constructor({
    id,
    password,
    email,
    username,
    profileImg,
    createdAt,
    updatedAt,
    emailVerified,
  }) {
    this.id = id
    this.password = password //private
    this.email = email
    this.username = username
    this.profileImg = profileImg
    this.createdAt = createdAt //private
    this.updatedAt = updatedAt //private
    this.emailVerified =Boolean(emailVerified)
  }



  async getFriends(){
    this.friends = await db_getFriends(this)
  }

  async getNotifications(){
    this.notifications = await db_getNotifications(this,true)
  }

  //esta funcion se llama en las respuestas para mandar
  //el objeto user a frontend sin enviar datos comprometidos
  publicData(){
    const result ={
      id:this.id,
      email:this.email,
      username:this.username,
      profileImg:this.profileImg ? `${BACKEND_URL}/public/usrPic/${this.profileImg}`:null,
      emailVerified:this.emailVerified
    }

    if(this.jwt){
      result.jwt=this.jwt
    }

    if(this.friends){
      result.friends = this.friends.map(x=>x.publicData())
    }

    if(this.notifications){
      result.notifications = this.notifications.map(x=>x.publicData())
    }

    return result
  }

  signJWT(){
    this.jwt = jwtSign({usr_id:this.id})
    return this.jwt
  }
}
