import { generateAlphaNumericNonRepeated } from "../utils/crypto.js"

export default class CodeVerificationList{
  constructor(){
    this.list = []
  }


  push(user){
    const check = this.list.find(x=>x.id === user.id)
    if(check){
      check.timestamp = new Date().getTime()
      return //check
    }

    const code = generateAlphaNumericNonRepeated(6,this.list,x=>x.code,20)

    //añade el codigo
    const obj = {
      user,
      code,
      timestamp:new Date().getTime()
    }

    this.list.push(obj)

    return obj
  }

  check(code,user){
    const found = this.list.find(x=>x.code === code && x.user.id === user.id)
    return found  
  }

  sanitize(){
    //clear old codes
  }
}



