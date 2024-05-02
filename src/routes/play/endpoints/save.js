import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import CodeVerificationList from "../../../logic/CodeVerificationList.js";

const router = express.Router();
export default router;



router.get('/save', tryCatch(async (req, res) => {

  const {textId, time, wpm, errors} = req.requireBodyData(["textId","time","wpm","errors"])


}))


