import { jwtSign } from "../utils/jwt.js"


export class User {
  constructor({
    id,
    password,
    email,
    username,
    profileImg,
    createdAt,
    updatedAt
  }) {
    this.id = id
    this.password = password //private
    this.email = email
    this.username = username
    this.profileImg = profileImg
    this.createdAt = createdAt //private
    this.updatedAt = updatedAt //private
  }


  //esta funcion se llama en las respuestas para mandar
  //el objeto user a frontend sin enviar datos comprometidos
  publicData(){
    const result ={
      id:this.id,
      email:this.email,
      username:this.username,
      profileImg:this.profileImg,
    }

    if(this.jwt){
      result.jwt=this.jwt
    }

    return result
  }

  signJWT(){
    this.jwt = jwtSign({usr_id:this.id})
    return this.jwt
  }
}
