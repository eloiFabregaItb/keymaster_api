
import crypto from "crypto"
export const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const CHARSET_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


// Function to hash a password with a salt
export function hashPassword(password) {
  
  const salt = process.env.PASSWORD_SALT || "splitmeet_salt"
  const iterations = 10000;
  const keylen = 64; // Key length in bytes
  const digest = 'sha512'; // Cryptographic digest algorithm
  
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  const result = hash.toString('hex');
  return result
}


export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}




export function generateAlphaNumeric(length = 8,charset=CHARSET){

  const codeArray = Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * charset.length);
    return charset[randomIndex];
  });

  return codeArray.join("");
  
}

export function generateAlphaNumericNonRepeated(length=8,existingCodes=[],codeGetter=undefined,trysAddChar=-1,charset=CHARSET){
  let chars = length
  let code;
  let count = 0

  function checkIfExists(c){
    if(codeGetter === undefined){
      return existingCodes.includes(c)
    }else if(typeof codeGetter === "function"){
      return existingCodes.some(x=>codeGetter(x) === c)
    }
  }
  
  //TODO every 10 attempts add 1 to the length
  do {
    count ++
    if(trysAddChar > 0){
      if(count>trysAddChar){
        count = 0
        chars ++
      }
    }
    code = generateAlphaNumeric(chars,charset)
  } while (checkIfExists(code))
  return code;
}
