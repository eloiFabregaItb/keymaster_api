import express from "express"
import bodyParser from 'body-parser'
const app = express()

import db from "./db/db.js"

const PORT = process.env.PORT || 3000

import router_auth from "./routes/auth/auth.js"


app.use(express.json())
app.use(bodyParser.json())



app.use("/auth",router_auth)




app.use("*",(req,res)=>{
  res.send("404")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});