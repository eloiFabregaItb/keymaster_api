import jwt from "jsonwebtoken"
import { db_getUserByJWT } from "../db/db_users.js";
import { ERROR } from "./requestManager.js";

const JWT_TIMEOUT = process.env.JWT_TIMEOUT || "288h" //12 dias
const JWT_SECRET = process.env.JWT_SECRET || "secretJWT"


export function jwtSign(data){
  return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_TIMEOUT });
}


// export async function jwtUserFromToken(token){
//   if(!token) return undefined
//   const user = db_getUserByJWT(token)
//   if(!user) return undefined
//   return user
// }



export async function jwtVerify(req, res, next) {
  try {
    let token =
      req.body.token || req.query.token || req.headers["authorization"] || req.headers["Authorization"];

    if (!token) {
      return res.status(403).json({
        success: false,
        msg: "A token is required for authentication",
      });
    }

    if(token.startsWith("Bearer ")){
      token = token.replace("Bearer ","")
    }

    const user = await db_getUserByJWT(token);

    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid Token" });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ success: false, msg: "Invalid Token" });
  }
}

