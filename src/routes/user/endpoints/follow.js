import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import { db_getUserByUsername } from "../../../db/db_users.js";
import { db_follow, db_unfollow } from "../../../db/db_friendships.js";

const router = express.Router();
export default router;


router.post('/follow',jwtVerify, tryCatch(async (req, res) => {

  const {followId,follow} = req.requireBodyData([["followId","follow"]])

  if(follow){
    const target = await db_getUserByUsername(follow)

    const data = await  db_follow(req.user,target)
    if(data.affectedRows === 0){
      return false
    }
  }

}))



router.post('/unfollow',jwtVerify, tryCatch(async (req, res) => {

  const {followId,follow} = req.requireBodyData([["followId","follow"]])

  if(follow){
    const target = await db_getUserByUsername(follow)

    const data = await  db_unfollow(req.user,target)
    if(data.affectedRows === 0){
      return false
    }
  }

}))
