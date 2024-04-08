import { Router } from "express"; 
const router = Router()
export default router

import register_router from "./endpoints/register.js"
import login_router from "./endpoints/login.js"
import forgotten_router from "./endpoints/forgotten.js"

router.use("",register_router)
router.use("",login_router)
router.use("",forgotten_router)
