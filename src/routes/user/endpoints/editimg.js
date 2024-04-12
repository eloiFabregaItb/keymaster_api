import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { tryCatch } from "../../../middleware/tryCatch.js";
import { makeUploader } from "../../../middleware/upload.js";
import bodyParser from "body-parser";
import { db_updateUserImg } from "../../../db/db_users.js";

const router = express.Router();
export default router;

// LOGIN with JWT
// router.post("/editimg", jwtVerify, async (req, res) => {
//   // Create token
//   req.user.signJWT();

//   //retornar un success
//   return res.json({ success: true, ...req.user.publicData() });
// });



// POST FORMDATA > /gestio/imageUploader/brand
router.post('/editimg',jwtVerify, makeUploader("image","usrPic/"),bodyParser.urlencoded({ extended: true }), tryCatch(async (req, res) => {
  // const {brandId} = req.body

  // if(!brandId){
  //   res.sendBad(ERROR.MISSING_DATA)
  // }
  
  // await db_brand_update_img(req.uploadMetadata.filename,brandId )
  // res.sendOk(req.uploadMetadata)

  db_updateUserImg(req.user,req.uploadMetadata.filename)

  console.log("IMG", req.user)
}))
