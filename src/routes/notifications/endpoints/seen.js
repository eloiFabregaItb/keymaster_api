import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import { db_seeNotifications } from "../../../db/db_notifications.js";

const router = express.Router();
export default router;


router.post('/seen',jwtVerify, tryCatch(async (req, res) => {

  const {ids} = req.requireBodyData(["ids"])

  await db_seeNotifications(req.user,ids.filter(x=>!isNaN(x)))

}))


