//modules
import express from "express"
import bodyParser from 'body-parser'

//routes
import router_auth from "./routes/auth/auth.js"


//middleware
import { ERROR, requestManager, sendResBAD } from "./utils/requestManager.js"
import { limiter } from "./middleware/rateLimiter.js"
import cors from "cors"



//VARIABLES
const PORT = process.env.PORT || 3000
const app = express()





//MIDDLEWARE
app.use(limiter)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/public",express.static("public"))
app.use(requestManager())


//ENDPOINTS
app.use("/auth",router_auth)



//404
app.use("*",(req,res)=>{
  sendResBAD(res,ERROR.NOT_FOUND)
})

//SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});