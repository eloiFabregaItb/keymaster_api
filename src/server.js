//modules
import express from "express"
import { Server as WSS } from "socket.io";
import http from "http"
import cors from "cors"

//utils
import "./testing.js"
import {sanitizeUsrPic} from "./utils/sanitize.js"

//constants
import { FRONTEND_URL } from "./constants.js";

//routes
import router_auth from "./routes/auth/auth.js"
import router_user from "./routes/user/user.js"
import router_notifications from "./routes/notifications/notifications.js"
import router_play from "./routes/play/play.js"

//middleware
import { ERROR, requestManager, sendResBAD } from "./utils/requestManager.js"
import { limiter } from "./middleware/rateLimiter.js"
import { ws } from "./ws/ws.js";

//enviroment
const ENVIRONMENT = process.env.STATUS || "development"
const ENVIRONMENT_PROD = process.env.STATUS_PROD || "produciton"
export const IS_PRODUCTION = ENVIRONMENT === ENVIRONMENT_PROD

const corsOptions = {
  origin: IS_PRODUCTION
    ? [FRONTEND_URL]  // Adjust this to your production domain(s)
    : "*",  // Allow all origins in development
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Allowed headers
};
const PORT = process.env.PORT || 3000

//SERVER
const app = express()
const server = http.createServer(app);
const io = new WSS(server,{cors:corsOptions});
ws(io)

if(IS_PRODUCTION){
  // production
  app.set('trust proxy', 1);
  app.disable('x-powered-by')
}

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
app.use("/notifications",router_notifications)
app.use("/play",router_play)


//404
app.use("*",(req,res)=>{
  sendResBAD(res,ERROR.NOT_FOUND)
})

//SERVER
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
