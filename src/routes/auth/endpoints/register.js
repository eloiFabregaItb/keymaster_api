import { Router } from "express"; 
import {tryCatch} from "../../../middleware/tryCatch.js"
import {isEmailValid, validatePassword} from "../../../utils/validations.js"
import { ERROR } from "../../../utils/requestManager.js";
import {db_createUser} from "../../../db/db_users.js"

const router = Router()
export default router


router.post("/register", tryCatch(async (req,res)=>{
  const {username,email,password} = req.requireBodyData(["username","email","password"])

  console.log(username,email,password)


  if(username.length < 4 || username.length > 25){
    return res.sendBad(ERROR.DATA_CORRUPT,"username minimo 4 caracteres")
  }

  if(!isEmailValid(email)){
    return res.sendBad(ERROR.DATA_CORRUPT,"email no valido")
  }

  const {valid,errors} = validatePassword(password)
  if(!valid){
    return res.sendBad(ERROR.PASSWORD_FORMAT,errors)
  }


  const newUser = await db_createUser(username,email,password,true)
  if(!newUser){
    return res.sendBad(ERROR.GENERAL)
  }

  res.sendOk(newUser)
}))



// // Function to encrypt data using the public key (client)
// export function encryptData(data, publicKey) {
//   const encryptedData = crypto.publicEncrypt(
//     {
//       key: publicKey,
//       padding: crypto.constants.RSA_PKCS1_PADDING,
//     },
//     Buffer.from(data)
//   );
//   return encryptedData.toString('base64');
// }

// // Function to decrypt data using the private key
// export function decryptData(encryptedData, privateKey) {
//   const decryptedData = crypto.privateDecrypt(
//     {
//       key: privateKey,
//       padding: crypto.constants.RSA_PKCS1_PADDING,
//     },
//     Buffer.from(encryptedData, 'base64')
//   );
//   return decryptedData.toString();
// }


// Generate key pair
// const { publicKey, privateKey } = generateKeyPair();

// // Encrypt data
// const data = 'Sensitive information';
// const encryptedData = encryptData(data, publicKey);
// console.log('Encrypted data:', encryptedData);

// // Decrypt data
// const decryptedData = decryptData(encryptedData, privateKey);
// console.log('Decrypted data:', decryptedData);