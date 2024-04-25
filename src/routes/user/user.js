import { Router } from "express"; 
const router = Router()
export default router

import edit_router from "./endpoints/delete.js"
import editImg_router from "./endpoints/editimg.js"
import follow_router from "./endpoints/follow.js"
import search_router from "./endpoints/search.js"

router.use("",edit_router)
router.use("",editImg_router)
router.use("",follow_router)
router.use("",search_router)
