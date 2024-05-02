import express from "express";

import { db_getUserByPassword } from "../../../db/db_users.js";
import { jwtVerify } from "../../../utils/jwt.js";
import { hashPassword } from "../../../utils/crypto.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import { notifyFriendsOfMyLogin } from "../../../ws/ws.js";

const router = express.Router();
export default router;

// LOGIN with JWT
router.post("/loginjwt", jwtVerify, async (req, res) => {
  // Create token
  req.user.signJWT();

  console.log(req.user)

  const user = req.user

  await user.getNotifications()
  await user.getFriends()
  await user.getFollowers()


  //retornar un success
  return res.json({ success: true, ...req.user.publicData() });
});

// LOGIN
router.post("/login", tryCatch(async (req, res) => {
  //comprueba que se han recibido todos los datos requeridos
  const {login,password} = req.requireBodyData(["login","password"]) //login puede ser username o correo

  console.log("LOGIN",login,password);

  // console.log("PASSWORD",usr_pass) //5c6f51c9b50b7550deeda3abc25889237972c11c28560a9ab6dd99f9dc817cb7 user3@example.com
  const pswdHash = hashPassword(password);

  const user = await db_getUserByPassword(login, pswdHash);

  await user.getNotifications()
  await user.getFriends()
  await user.getFollowers()
  
  //si no hay resultados
  if (!user) {
    // No user found, send a response with success:false
    return res.json({
      success: false,
      msg: "User/Password combo doesn't match",
    });
  }

  // Create token
  user.signJWT();

  //retornar un success
  return res.json({ success: true, ...user.publicData() });

}));
