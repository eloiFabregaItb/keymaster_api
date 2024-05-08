import { CustomError, ERROR } from "./requestManager.js"

export function obfuscateEmail(email){
  const atat = email.indexOf("@")
  if(atat === -1 ) throw new CustomError(ERROR.UNEXISTENT, "no @ present")

  const a = email.substring(0,2)
  const b = email.substring(atat-2,atat)
  const dom = email.substring(atat+1)

  return a + "***" + b + "@" + dom

}