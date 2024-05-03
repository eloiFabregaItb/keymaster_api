import { Router } from "express"; 
import {tryCatch} from "../../../middleware/tryCatch.js"
import {isEmailValid, validatePassword} from "../../../utils/validations.js"
import { CustomError, ERROR } from "../../../utils/requestManager.js";
import {db_createUser, db_getUserByUsername, db_updateUserEmailValidated} from "../../../db/db_users.js"
import { hashPassword } from "../../../utils/crypto.js";
import CodeVerificationList from "../../../logic/CodeVerificationList.js";
import { sendEmailVerifyEmail } from "../../../mailer/emailVerifyEmail.js";
import { jwtVerify } from "../../../utils/jwt.js";
import { FRONTEND_URL } from "../../../constants.js";

const router = Router()
export default router

const codeWaiting = new CodeVerificationList()


router.post("/register", tryCatch(async (req,res)=>{
  const {username,email,password} = req.requireBodyData(["username","email","password"])

  console.log(username,email,password)


  if(username.length < 4 || username.length > 25){
    return res.sendBad(ERROR.DATA_CORRUPT,"username entre 4 y 25 caracteres")
  }

  if(!isEmailValid(email)){
    return res.sendBad(ERROR.DATA_CORRUPT,"email no valido")
  }

  const {valid,errors} = validatePassword(password)
  if(!valid){
    return res.sendBad(ERROR.PASSWORD_FORMAT,errors)
  }

  const pswdHash = hashPassword(password);

  const newUser = await db_createUser(username,email,pswdHash,true)
  if(!newUser){
    return res.sendBad(ERROR.GENERAL)
  }

  const {code} = codeWaiting.push(newUser)

  await sendEmailVerifyEmail(email,code)

  res.sendOk(newUser)
}))




router.get("/validate", tryCatch( async (req,res)=>{
  const {code,email} = req.query

  
  if(!code || !email){
    throw new CustomError(ERROR.CREDENTIALS)
  }
  
  const user = await db_getUserByUsername(email);
  
  if (!user) {
    throw new CustomError(ERROR.NOT_FOUND, "User not found")
  }
  
  const check = codeWaiting.check(code,user)
  
  console.log("VALIDATE")

  if(check){
    db_updateUserEmailValidated(user)
  }

  res.redirect(FRONTEND_URL);

}))


router.post("/requestvalidation", jwtVerify, tryCatch(async(req,res)=>{

  const user = req.user

  if(user.emailVerified){
    throw new CustomError(ERROR.ALREADY_DONE)
  }

  const {code} = codeWaiting.push(user)

  await sendEmailVerifyEmail(user.email,code)

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