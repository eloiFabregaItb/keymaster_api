import rateLimit from "express-rate-limit"
import { ERROR, sendResBAD } from "../utils/requestManager.js";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs,
  handler:sendRateLimit
})

function sendRateLimit(req,res) {
  sendResBAD(res,ERROR.RATE_LIMIT)
}