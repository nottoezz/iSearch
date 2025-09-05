import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  listFavourites,
  addFavourite,
  removeFavourite,
} from "../controllers/favourite.controller.js";

// favourites routes
const router = Router();
router.use(auth);
router.get("/", listFavourites);
router.post("/", addFavourite);
router.delete("/:itemId", removeFavourite);

export default router;
