import express from "express";

import { tryCatch } from "../../../middleware/tryCatch.js";
import { jwtVerify } from "../../../utils/jwt.js";

import {db_getHistory} from "../../../db/db_games.js"

const router = express.Router();
export default router;



router.get('/history',jwtVerify, tryCatch(async (req, res) => {


  const users = await db_getHistory(req.user)

  return users.map(x=>x.publicData())


}))






