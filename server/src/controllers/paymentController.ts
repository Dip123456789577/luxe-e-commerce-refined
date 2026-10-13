import { Request, Response, NextFunction } from "express";
import { Order } from "../models/Order";
import { verifyRazorpaySignature, verifyStripeWebhookSignature } from "../services/paymentService";

export async function verifyPayment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { orderNumber, razorpayPaymentId, razorpayOrderId, razorpaySignature, provider } =
      req.body;

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found." });
      return;
    }

    if (provider === "RAZORPAY") {
      const isValid = verifyRazorpaySignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });

      if (!isValid) {
        res
          .status(400)
          .json({ success: false, message: "Invalid payment cryptographic signature." });
        return;
      }

      order.paymentStatus = "PAID";
      order.paymentReference = razorpayPaymentId;
      order.timeline.push({
        status: "PAID",
        timestamp: new Date(),
        note: `Verified payment received via Razorpay: ${razorpayPaymentId}`,
      });
      await order.save();
    } else {
      // Demo payment verification
      order.paymentStatus = "PAID";
      order.paymentReference = `demo_ref_${Date.now()}`;
      order.timeline.push({
        status: "PAID",
        timestamp: new Date(),
        note: "Verified simulated payment transaction.",
      });
      await order.save();
    }

    res.json({
      success: true,
      message: "Payment successfully verified.",
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const signature = String(
      req.headers["x-razorpay-signature"] || req.headers["stripe-signature"] || "",
    );
    const isValid = verifyStripeWebhookSignature({
      payload: req.body,
      signature,
    });

    if (!isValid) {
      res.status(400).json({ success: false, message: "Invalid webhook signature." });
      return;
    }

    // In a live integration, parse event type and update order idempotently
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}
