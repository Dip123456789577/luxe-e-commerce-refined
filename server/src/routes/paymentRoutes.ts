import { Router } from "express";
import { verifyPayment, handleWebhook } from "../controllers/paymentController";

const router = Router();

router.post("/verify", verifyPayment);
router.post("/webhook", handleWebhook);

export default router;
