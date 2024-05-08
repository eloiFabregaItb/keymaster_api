import { Router } from "express"; 
const router = Router()
export default router

import generate_router from "./endpoints/generate.js"
import text_router from "./endpoints/newText.js"
import save_router from "./endpoints/save.js"
import ranking_router from "./endpoints/ranking.js"
import history_router from "./endpoints/history.js"

router.use("",generate_router)
router.use("",text_router)
router.use("",save_router)
router.use("",ranking_router)
router.use("",history_router)