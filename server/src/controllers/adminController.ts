import { Request, Response, NextFunction } from "express";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { Coupon } from "../models/Coupon";
import { Review } from "../models/Review";
import { Category } from "../models/Category";

export async function getDashboardOverview(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const [totalOrders, paidOrders, customersCount, productsCount, lowStockProducts, recentOrders] =
      await Promise.all([
        Order.countDocuments(),
        Order.find({ paymentStatus: "PAID" }),
        User.countDocuments({ role: "CUSTOMER" }),
        Product.countDocuments(),
        Product.find({ stock: { $lte: 5 } }).select("name stock sku price images"),
        Order.find().sort({ createdAt: -1 }).limit(10),
      ]);

    const grossSales = paidOrders.reduce((sum, ord) => sum + ord.total, 0);

    res.json({
      success: true,
      data: {
        totalOrders,
        grossSales,
        customersCount,
        productsCount,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Product Management
export async function getAdminProducts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "50"), 10)));
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, sku, price, category } = req.body;
    let slug = req.body.slug;
    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const existing = await Product.findOne({ $or: [{ slug }, { sku }] });
    if (existing) {
      res
        .status(409)
        .json({ success: false, message: "A product with this slug or SKU already exists." });
      return;
    }

    const product = await Product.create({
      ...req.body,
      slug,
      sku: sku.toUpperCase().trim(),
      price: parseFloat(price),
    });

    res.status(201).json({
      success: true,
      message: "Product created.",
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }
    res.json({ success: true, message: "Product updated.", data: product });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }
    res.json({ success: true, message: "Product deleted." });
  } catch (err) {
    next(err);
  }
}

// Order Management
export async function getAdminOrders(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "20"), 10)));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (req.query.status) {
      filter.fulfillmentStatus = req.query.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { orderId } = req.params;
    const { fulfillmentStatus, paymentStatus, trackingNumber, note } = req.body;

    const order = await Order.findOne({ orderNumber: orderId });
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found." });
      return;
    }

    if (fulfillmentStatus) {
      order.fulfillmentStatus = fulfillmentStatus;
      order.timeline.push({
        status: fulfillmentStatus,
        timestamp: new Date(),
        note: note || `Status updated to ${fulfillmentStatus} by administrator.`,
      });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    res.json({ success: true, message: "Order status updated.", data: order });
  } catch (err) {
    next(err);
  }
}

// Customers Management
export async function getAdminCustomers(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const customers = await User.find({ role: "CUSTOMER" })
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: customers });
  } catch (err) {
    next(err);
  }
}

// Coupon Management
export async function getAdminCoupons(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) {
    next(err);
  }
}

export async function createCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: "Privilege coupon created.", data: coupon });
  } catch (err) {
    next(err);
  }
}

export async function deleteCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.json({ success: true, message: "Coupon deleted." });
  } catch (err) {
    next(err);
  }
}

// Review Moderation
export async function getAdminReviews(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).populate("productId", "name");
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
}

export async function moderateReview(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(id, { isApproved }, { new: true });
    res.json({ success: true, message: "Review status updated.", data: review });
  } catch (err) {
    next(err);
  }
}
