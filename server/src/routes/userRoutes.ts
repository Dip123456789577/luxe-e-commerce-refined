import { Router } from "express";
import {
  getProfile,
  updateProfile,
  addAddress,
  removeAddress,
  getWishlist,
  toggleWishlist,
} from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.post("/addresses", addAddress);
router.delete("/addresses/:addressId", removeAddress);
router.get("/wishlist", getWishlist);
router.post("/wishlist/toggle", toggleWishlist);

export default router;
