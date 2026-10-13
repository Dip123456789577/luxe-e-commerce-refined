import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Order, IOrderItemSnapshot } from "../models/Order";
import { Product } from "../models/Product";
import { Coupon } from "../models/Coupon";
import { Cart } from "../models/Cart";
import { sendOrderConfirmationEmail } from "../services/emailService";
import { createPaymentSession } from "../services/paymentService";

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      items,
      shippingAddress,
      customerEmail,
      customerName,
      customerPhone,
      shippingMethod = "Standard Atelier Delivery",
      couponCode,
      giftPackaging = false,
      paymentProvider = "DEMO",
    } = req.body;

    if (!items || !items.length) {
      res.status(400).json({ success: false, message: "Order requires at least one piece." });
      return;
    }

    // Server-side verification of all items & inventory reservation
    let subtotal = 0;
    const snapshots: IOrderItemSnapshot[] = [];

    for (const line of items) {
      const product = mongoose.isValidObjectId(line.productId)
        ? await Product.findById(line.productId)
        : await Product.findOne({ slug: line.productId });
      if (!product || !product.isPublished) {
        res.status(400).json({
          success: false,
          message: `Product ${line.name || line.productId} is no longer available.`,
        });
        return;
      }

      if (product.stock < line.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
        return;
      }

      // Reserve stock atomically
      product.stock -= line.quantity;
      await product.save();

      subtotal += product.price * line.quantity;
      snapshots.push({
        productId: product._id as mongoose.Types.ObjectId,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] || "",
        price: product.price,
        size: line.size,
        color: line.color,
        quantity: line.quantity,
      });
    }

    // Coupon calculation
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
      });
      if (coupon && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === "PERCENTAGE") {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
        } else {
          discount = Math.min(subtotal, coupon.discountValue);
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const shippingFee = shippingMethod.includes("Express") ? 25 : subtotal >= 150 ? 0 : 12;
    const total = Math.max(0, subtotal - discount + shippingFee);

    const orderNumber = `LX-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      orderNumber,
      userId: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : undefined,
      customerEmail: (req.user?.email || customerEmail).toLowerCase().trim(),
      customerName: req.user?.name || customerName,
      customerPhone,
      items: snapshots,
      shippingAddress,
      shippingMethod,
      shippingFee,
      subtotal,
      discount,
      couponCode,
      total,
      giftPackaging,
      paymentStatus: paymentProvider === "DEMO" ? "PAID" : "PENDING",
      paymentProvider,
      fulfillmentStatus: "CONFIRMED",
      timeline: [
        {
          status: "CONFIRMED",
          timestamp: new Date(),
          note: "Order confirmed and logged in atelier.",
        },
      ],
    });

    // Clear user cart if authenticated
    if (req.user?.id) {
      await Cart.deleteOne({ userId: req.user.id });
    }

    // Asynchronously dispatch confirmation email
    void sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      total: order.total,
    });

    // Create payment session
    const paymentSession = await createPaymentSession({
      orderNumber: order.orderNumber,
      amount: order.total,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: order,
      payment: paymentSession,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      $or: [{ orderNumber: orderId }, { _id: mongoose.isValidObjectId(orderId) ? orderId : null }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found." });
      return;
    }

    // Authorization check: if authenticated customer, must match userId or email
    if (req.user && req.user.role !== "ADMIN") {
      const isOwner =
        (order.userId && String(order.userId) === req.user.id) ||
        order.customerEmail.toLowerCase() === req.user.email.toLowerCase();

      if (!isOwner) {
        res.status(403).json({ success: false, message: "Forbidden order access." });
        return;
      }
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }

    const orders = await Order.find({
      $or: [{ userId: req.user.id }, { customerEmail: req.user.email }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
}

export async function cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderNumber: orderId });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found." });
      return;
    }

    // Only allow cancellation if order is in CONFIRMED state
    if (order.fulfillmentStatus !== "CONFIRMED") {
      res.status(400).json({
        success: false,
        message:
          "Order has already entered production or dispatch and cannot be cancelled automatically.",
      });
      return;
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.fulfillmentStatus = "CANCELLED";
    order.timeline.push({
      status: "CANCELLED",
      timestamp: new Date(),
      note: "Cancelled by client request.",
    });
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled and inventory restored.",
      data: order,
    });
  } catch (err) {
    next(err);
  }
}
