import express from "express";

import { tryCatch } from "../../../middleware/tryCatch.js";
import { jwtVerify } from "../../../utils/jwt.js";

import {db_getHistory, db_getRankPosition} from "../../../db/db_games.js"

const router = express.Router();
export default router;



router.get('/history',jwtVerify, tryCatch(async (req, res) => {


  const history = await db_getHistory(req.user)

  const rank = await db_getRankPosition(req.user)
  const keyboard = calculateKeyboard(history)

  return {keyboard, history, rank}




}))














function calculateKeyboard(history){
  const keyboard = {}
  const characters = {}
  
  for (const h of history) {
    const errors = h.errors
    
    for (const key in errors) {
      const {letter, char, err} = errors[key]
      const errKey = letter || char //if no letter, use char as a key
      
      if(characters[errKey]){
        characters[errKey] += err
      }else{
        characters[errKey] = err
      }
      
    }
  }
  
  const max = Object.values(characters).reduce((acc,v)=>Math.max(acc,v),0)

  for (const key in characters) {
    const v = characters[key]
    keyboard[key] = Math.floor(v *100 /max)
  }


  return keyboard
}



