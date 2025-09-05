import { Router } from "express";
import { handleSearch } from "../controllers/search.controller.js";
import auth from "../middleware/auth.js"

// set search routes
const router = Router();
router.get("/", auth, handleSearch)
export default router;