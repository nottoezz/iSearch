import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getRating,
  setRating,
  removeRating,
} from "../controllers/rating.controller.js";

const router = Router();
router.use(auth);

router.get("/:itemId", getRating);
router.post("/:itemId", setRating);
router.delete("/:itemId", removeRating);

export default router;
