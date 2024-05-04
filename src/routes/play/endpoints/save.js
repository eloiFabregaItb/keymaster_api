import express from "express";

import { tryCatch } from "../../../middleware/tryCatch.js";

import {db_getRanking} from "../../../db/db_games.js"

const router = express.Router();
export default router;



router.get('/ranking', tryCatch(async (req, res) => {


  await db_getRanking()


}))


