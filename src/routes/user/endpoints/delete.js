import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import CodeVerificationList from "../../../logic/CodeVerificationList.js";
import { sendEmailDeleteAccountConfirmation } from "../../../mailer/emailDeleteAccount.js";
import { db_deleteUser, db_getUserByUsername } from "../../../db/db_users.js";
import { obfuscateEmail } from "../../../utils/obfuscate.js";
import { FRONTEND_URL } from "../../../constants.js";
import { CustomError, ERROR } from "../../../utils/requestManager.js";

const router = express.Router();
export default router;


const codeWaiting = new CodeVerificationList()


router.post("/delete", jwtVerify, tryCatch(async (req, res) => {

  const emailObfuscated = obfuscateEmail(req.user.email)
  const {code} = codeWaiting.push(req.user)

  sendEmailDeleteAccountConfirmation(req.user.email,code)
  return {email:emailObfuscated}

}));


router.all("/confirmdelete", tryCatch(async (req,res)=>{

  let user,code_
  if (req.method === 'GET') {
    const {code,email} = req.requireBodyData(["code","email"])
    user = await db_getUserByUsername(email,true)
    code_ = code
  }else if(req.method === 'POST'){
    const {code,login} = req.requireBodyData(["code","login"])
    user = await db_getUserByUsername(login)
    code_ = code
  }else{
    throw new CustomError(ERROR)
  }


  const check = codeWaiting.check(code_,user)

  if(check){
    console.log("DELETING USER 2",user.username)
    await db_deleteUser(user.id)
  }else{
    throw new CustomError(ERROR.CREDENTIALS,"Código incorrecto")
  }

  if(req.method === 'GET'){

    res.redirect(FRONTEND_URL);
  }

}))



