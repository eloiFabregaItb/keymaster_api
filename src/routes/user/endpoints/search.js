import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import { CustomError,ERROR} from "../../../utils/requestManager.js";
import { db_searchUsers } from "../../../db/db_users.js";

const router = express.Router();
export default router;

//MOSTLY FOR TESTING
router.post('/whoami',jwtVerify, tryCatch(async (req, res) => {

  return req.user
  

}))



router.post('/search',jwtVerify, tryCatch(async (req, res) => {
  const {search} = req.requireBodyData([["search"]])

  const users = await db_searchUsers(search)

  const filterUsers = users.filter(x=>x.id !== req.user.id)

  return {users:filterUsers.map(x=>x.publicData())}

}))

