import { EMAIL_CODE_EXPIRATION } from "../constants.js"
import { generateAlphaNumericNonRepeated } from "../utils/crypto.js"

export default class CodeVerificationList{
  constructor(){
    this.list = []
  }


  push(user){
    this.sanitize()
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
    this.sanitize()
    const found = this.list.find(x=>x.code === code && x.user.id === user.id)
    return found  
  }

  sanitize(){
    const now = new Date().getTime();
    this.list = this.list.filter(
      (x) => now - x.timestamp <= EMAIL_CODE_EXPIRATION * 60000
    );
  }
}



