import express from "express";

import { tryCatch } from "../../../middleware/tryCatch.js";

import { db_getTexts} from "../../../db/db_texts.js"

const router = express.Router();
export default router;


const lorem = []

router.get('/newtext', tryCatch(async (req, res) => {

  const {language, category} = req.requireBodyData([["language","category",true]])

  const result = await db_getTexts(50,language,category)

  return result


}))


