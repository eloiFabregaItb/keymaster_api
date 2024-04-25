import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import { db_getUserByUsername } from "../../../db/db_users.js";
import { db_follow, db_getFollowers, db_getFriends, db_unfollow } from "../../../db/db_friendships.js";
import { db_getUserByID } from "../../../db/db_users.js";
import { CustomError } from "../../../utils/requestManager.js";
import { ERROR } from "../../../utils/requestManager.js";

const router = express.Router();
export default router;


router.post('/follow',jwtVerify, tryCatch(async (req, res) => {

  const {followId,follow} = req.requireBodyData([["followId","follow"]])

  const target = Boolean(follow)
    ? await db_getUserByUsername(follow)
    : await db_getUserByID(followId)


  if(target.id === req.user.id){
    throw new CustomError(ERROR.ALREADY_DONE,"No te puedes seguir a ti mismo")
  }

  const data = await  db_follow(req.user,target)
  if(data.affectedRows === 0){
    return false
  }

  const friends = await db_getFriends(req.user)
  const followers = await db_getFollowers(req.user)
 
  return {
    friends:friends.map(u=>u.publicData()),
    followers:followers.map(u=>u.publicData()),
  }

}))



router.post('/unfollow',jwtVerify, tryCatch(async (req, res) => {

  const {unfollowId,unfollow} = req.requireBodyData([["unfollowId","unfollow"]])

  const target = Boolean(unfollow)
  ? await db_getUserByUsername(unfollow)
  : await db_getUserByID(unfollowId)

  const data = await  db_unfollow(req.user,target)
  if(data.affectedRows === 0){
    return false
  }

  const friends = await db_getFriends(req.user)
  const followers = await db_getFollowers(req.user)
  return {
    friends:friends.map(u=>u.publicData()),
    followers:followers.map(u=>u.publicData()),
  }

}))
