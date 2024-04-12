import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import CodeVerificationList from "../../../logic/CodeVerificationList.js";
import { sendEmailDeleteAccountConfirmation } from "../../../mailer/emailDeleteAccount.js";
import { db_deleteUser, db_getUserByUsername } from "../../../db/db_users.js";
import { obfuscateEmail } from "../../../utils/obfuscate.js";
import { FRONTEND_URL } from "../../../constants.js";

const router = express.Router();
export default router;


const codeWaiting = new CodeVerificationList()


router.post("/delete", jwtVerify, tryCatch(async (req, res) => {

  const emailObfuscated = obfuscateEmail(req.user.email)
  const {code} = codeWaiting.push(req.user)

  sendEmailDeleteAccountConfirmation(req.user.email,code)
  return {email:emailObfuscated}

}));


router.get("/confirmdelete", tryCatch(async (req,res)=>{
  const {code,email} = req.query
  if(!code || !email){
    throw new CustomError(ERROR.CREDENTIALS)
  }

  const user = await db_getUserByUsername(email);

  if (!user) {
    throw new CustomError(ERROR.NOT_FOUND, "User not found")
  }
  const check = codeWaiting.check(code,user)

  if(check){
    db_deleteUser(user.id)
  }

  res.redirect(FRONTEND_URL);

}))


router.post("/confirmdelete", tryCatch(async (req,res)=>{
  const {code,login} = req.requireBodyData(["code","login"])
  if(!code || !login){
    throw new CustomError(ERROR.CREDENTIALS)
  }

  const user = await db_getUserByUsername(login);

  if (!user) {
    throw new CustomError(ERROR.NOT_FOUND, "User not found")
  }
  const check = codeWaiting.check(code,user)

  if(check){
    db_deleteUser(user.id)
  }


}))


