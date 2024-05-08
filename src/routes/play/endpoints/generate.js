import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import CodeVerificationList from "../../../logic/CodeVerificationList.js";

const router = express.Router();
export default router;


const codeWaiting = new CodeVerificationList()

router.post('/generate',jwtVerify, tryCatch(async (req, res) => {

  const {users} = req.requireBodyData(["users"])


  return "GENERATE"

}))


