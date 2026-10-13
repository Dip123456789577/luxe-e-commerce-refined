import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
} from "../controllers/orderController";
import { optionalAuth, authenticate } from "../middleware/auth";

const router = Router();

router.post("/", optionalAuth, createOrder);
router.get("/me", authenticate, getMyOrders);
router.get("/:orderId", optionalAuth, getOrderById);
router.patch("/:orderId/cancel", optionalAuth, cancelOrder);

export default router;
