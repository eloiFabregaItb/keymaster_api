import { Router } from "express"; 
const router = Router()
export default router

import generate_router from "./endpoints/generate.js"
import text_router from "./endpoints/newText.js"

router.use("",generate_router)
router.use("",text_router)