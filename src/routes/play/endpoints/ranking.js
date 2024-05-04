import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";

const router = express.Router();
export default router;

import {db_saveGame} from "../../../db/db_games.js"


router.post('/save',jwtVerify, tryCatch(async (req, res) => {

  const {textId, time, wpm, errors} = req.requireBodyData(["textId","time","wpm","errors"])

  console.log("REVIEVED GAME",textId, time, wpm, errors)
  await db_saveGame(req.user,textId,time,wpm,errors)


}))


