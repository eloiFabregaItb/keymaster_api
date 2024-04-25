import { Router } from "express"; 
const router = Router()
export default router

import generate_router from "./endpoints/generate.js"

router.use("",generate_router)