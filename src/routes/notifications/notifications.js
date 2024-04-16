import { Router } from "express"; 
const router = Router()
export default router

import seen_router from "./endpoints/seen.js"

router.use("",seen_router)
