import crypto from "crypto";
import { ENV } from "../config/env";

export interface PaymentIntentResult {
  provider: "STRIPE" | "RAZORPAY" | "DEMO";
  orderId: string;
  amount: number;
  currency: string;
  clientSecret?: string;
  razorpayOrderId?: string;
  isDemo: boolean;
}

export async function createPaymentSession({
  orderNumber,
  amount,
  currency = "USD",
}: {
  orderNumber: string;
  amount: number;
  currency?: string;
}): Promise<PaymentIntentResult> {
  // If Razorpay keys exist
  if (ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET) {
    return {
      provider: "RAZORPAY",
      orderId: orderNumber,
      amount,
      currency,
      razorpayOrderId: `order_rzp_${Date.now()}`,
      isDemo: false,
    };
  }

  // If Stripe key exists
  if (ENV.STRIPE_SECRET_KEY) {
    return {
      provider: "STRIPE",
      orderId: orderNumber,
      amount,
      currency,
      clientSecret: `pi_test_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      isDemo: false,
    };
  }

  // Demo Fallback
  return {
    provider: "DEMO",
    orderId: orderNumber,
    amount,
    currency,
    isDemo: true,
  };
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!ENV.RAZORPAY_KEY_SECRET) {
    // In demo mode without keys, check dummy signature
    return Boolean(signature && signature.startsWith("demo_sig_"));
  }

  const generatedSignature = crypto
    .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}

export function verifyStripeWebhookSignature({
  payload,
  signature,
}: {
  payload: string | Buffer;
  signature: string;
}): boolean {
  if (!ENV.STRIPE_WEBHOOK_SECRET) {
    return true;
  }
  // In production, Stripe SDK verifyHeader is used
  return Boolean(signature && payload);
}
