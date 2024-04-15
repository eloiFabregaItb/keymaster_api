//modules
import express from "express"

import "./testing.js"
import {sanitizeUsrPic} from "./utils/sanitize.js"

//routes
import router_auth from "./routes/auth/auth.js"
import router_user from "./routes/user/user.js"


//middleware
import { ERROR, requestManager, sendResBAD } from "./utils/requestManager.js"
import { limiter } from "./middleware/rateLimiter.js"
import cors from "cors"



//VARIABLES
const PORT = process.env.PORT || 3000
const app = express()


sanitizeUsrPic()


//MIDDLEWARE
app.use(limiter)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/public",express.static("public"))
app.use(requestManager())


//ENDPOINTS
app.use("/auth",router_auth)
app.use("/user",router_user)



//404
app.use("*",(req,res)=>{
  sendResBAD(res,ERROR.NOT_FOUND)
})

//SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});