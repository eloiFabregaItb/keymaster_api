import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";

const router = express.Router();
export default router;

import {db_saveGame} from "../../../db/db_games.js"
import { CustomError } from "../../../utils/requestManager.js";
import { ERROR } from "../../../utils/requestManager.js";


router.post('/save',jwtVerify, tryCatch(async (req, res) => {

  const {textId, time, wpm, errors,scm} = req.requireBodyData(["textId","time","wpm","errors","scm"])

  const checksum = calculateSCM(req.user.email,textId,time,wpm,errors)
  if(scm !== checksum){
    throw new CustomError(ERROR.DATA_CORRUPT)
  }

  await db_saveGame(req.user,textId,time,wpm,errors)

}))






function calculateSCM(username, textId, time, wpm, errors){

  const a = Number(Number(time).toString(16).split("").filter(x=>!isNaN(x)).join(""))

  let b = 123
  const keys = Object.keys(errors)
  for(let i=0;i<keys.length;i++){
    const key = keys[i]
    const value = errors[key]
    const parsed = Number(key) * Number(value.err)

    b+= (i%2===0 ? parsed : -parsed)
  }
  b=Math.abs(b)

  const c = (textId * 17 + 12345) % 100000;
  const d = (wpm * 31 + 6789) % 100000;
  const e = username.split("").map(x=>x.charCodeAt(0)).reduce((acc,v)=>(acc*33+v)%1000)

  const checksum = a+b+c+d+e
  return checksum

}