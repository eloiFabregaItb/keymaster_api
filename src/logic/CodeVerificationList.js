import { generateAlphaNumericNonRepeated } from "../utils/crypto.js"

export default class CodeVerificationList{
  constructor(){
    this.list = []
  }


  push(email,login=undefined){
    const check = this.list.find(x=>x.email === email)
    if(check){
      check.timestamp = new Date().getTime()
      return //check
    }

    const code = generateAlphaNumericNonRepeated(6,this.list,x=>x.code,20)

    //añade el codigo
    const obj = {
      email,
      code,
      timestamp:new Date().getTime()
    }

    if(login){
      obj.login = login
    }
    this.list.push(obj)

    return obj
  }

  sanitize(){
    //clear old codes
  }

  check(code,email=undefined,login=undefined){
    if(email && login){
      const found = this.list.find(x=>x.code === code && x.email === email && x.login === login)
      return found  
    } else if(email){
      const found = this.list.find(x=>x.code === code && x.email === email)
      return found  
    } else if(login){
      const found = this.list.find(x=>x.code === code && x.login === login)
      return found
    }
  }
}



