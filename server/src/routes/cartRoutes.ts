import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  syncGuestCart,
} from "../controllers/cartController";
import { optionalAuth, authenticate } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuth, getCart);
router.post("/items", optionalAuth, addToCart);
router.patch("/items", optionalAuth, updateCartItem);
router.delete("/items", optionalAuth, removeCartItem);
router.post("/sync", authenticate, syncGuestCart);

export default router;
