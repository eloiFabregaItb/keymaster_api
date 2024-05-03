import { BACKEND_URL } from "../constants.js"
import { jwtSign } from "../utils/jwt.js"
import {db_getFriends} from "../db/db_friendships.js"
import {db_getNotifications} from "../db/db_notifications.js"
import { db_getFollowers } from "../db/db_friendships.js"
import { isUserOnline } from "../ws/ws.js"


export class User {
  #password
  #createdAt
  #updatedAt
  #emailVerified
  constructor({
    id,
    password,
    email,
    username,
    profileImg,
    createdAt,
    updatedAt,
    emailVerified,
    following,
    followed_by
  }) {
    this.id = id
    this.#password = password //private
    this.email = email
    this.username = username
    this.profileImg = profileImg
    this.#createdAt = createdAt //private
    this.#updatedAt = updatedAt //private
    this.#emailVerified =Boolean(emailVerified) //private

    //optionals
    this.following = following !== undefined ? Boolean(following) : following
    this.followedBy = followed_by !== undefined ? Boolean(followed_by) : followed_by
  }


  comparePswd(pswd){
    return this.#password === pswd
  }

  setSocket (socket){
    this.socket = socket
  }

  isEmailVerified(){
    return this.#emailVerified
  }

  async getFriends(){
    this.friends = await db_getFriends(this)
  }

  async getFollowers(){
    this.followers = await db_getFollowers(this)
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
      emailVerified:this.#emailVerified,
      online:isUserOnline(this)
    }

    // OPTIONAL DATA

    if(this.following !== undefined) result.following = this.following
    if(this.followedBy !== undefined) result.followedBy = this.followedBy
    
    if(this.jwt) result.jwt=this.jwt

    if(this.friends){
      result.friends = this.friends.map(x=>x.publicData())
    }

    if(this.followers){
      result.followers = this.followers.map(x=>x.publicData())
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
