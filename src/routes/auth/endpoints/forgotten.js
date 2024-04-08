import express from "express";

import { db_getUserByUsername } from "../../../db/db_users.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import { obfuscateEmail } from "../../../utils/obfuscate.js";
import CodeVerificationList from "../../../logic/CodeVerificationList.js";
import { CustomError, ERROR } from "../../../utils/requestManager.js";

const router = express.Router();
export default router;



const codeWaiting = new CodeVerificationList()



// forgotten
router.post("/forgotten", tryCatch(async (req, res) => {
  //comprueba que se han recibido todos los datos requeridos
  const {login} = req.requireBodyData(["login"]) //login puede ser username o correo

  console.log("FORGOTTEN",login);

  const user = await db_getUserByUsername(login);

  //si no hay resultados
  if (!user) {
    // No user found, send a response with success:false
    return res.json({
      success: false,
      msg: "User not found",
    });
  }

  const emailObfuscated = obfuscateEmail(user.email)
  const {code} = codeWaiting.push(user.email,login)

  console.log("TODO, SEND EMAIL TO",user.email,"with code", code )

  //retornar un success
  return res.send({email: emailObfuscated})
}));


router.post("/checkforgoten", tryCatch(async (req,res)=>{

  const {login,code} = req.requireBodyData(["login","code"])

  const keyCode = codeWaiting.check(code,undefined,login)
  
  if(keyCode){
    return "true"
  }

  throw new CustomError(ERROR.UNEXISTENT, "no code matching")
}))






