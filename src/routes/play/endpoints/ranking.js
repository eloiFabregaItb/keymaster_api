import express from "express";

import { tryCatch } from "../../../middleware/tryCatch.js";

import {db_getRankingUsers} from "../../../db/db_games.js"

const router = express.Router();
export default router;



router.get('/ranking', tryCatch(async (req, res) => {


  const users = await db_getRankingUsers()

  return users.map(x=>x.publicData())
  // return users.map(x=>x.publicData())


}))






