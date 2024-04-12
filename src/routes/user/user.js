import { Router } from "express"; 
const router = Router()
export default router

import edit_router from "./endpoints/delete.js"
import editImg_router from "./endpoints/editimg.js"

router.use("",editImg_router)
router.use("",edit_router)
