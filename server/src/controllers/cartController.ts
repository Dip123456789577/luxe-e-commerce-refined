import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { Coupon } from "../models/Coupon";

export async function getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const guestToken = req.headers["x-guest-token"] as string;

    const query = userId ? { userId } : { guestToken };
    if (!userId && !guestToken) {
      res.json({
        success: true,
        data: { items: [], subtotal: 0, discount: 0, total: 0 },
      });
      return;
    }

    const cart = await Cart.findOne(query).populate("items.productId");
    if (!cart) {
      res.json({
        success: true,
        data: { items: [], subtotal: 0, discount: 0, total: 0, giftPackaging: false },
      });
      return;
    }

    // Server-side price calculation
    let subtotal = 0;
    const formattedItems = [];

    for (const item of cart.items) {
      const product = item.productId as unknown as {
        _id: mongoose.Types.ObjectId;
        name: string;
        price: number;
        images: string[];
        slug: string;
      };

      if (product) {
        subtotal += product.price * item.quantity;
        formattedItems.push({
          productId: String(product._id),
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] || "",
          price: product.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        });
      }
    }

    // Check coupon if applied
    let discount = 0;
    if (cart.appliedCoupon) {
      const coupon = await Coupon.findOne({ code: cart.appliedCoupon, isActive: true });
      if (coupon && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === "PERCENTAGE") {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
        } else {
          discount = Math.min(subtotal, coupon.discountValue);
        }
      }
    }

    const shippingThreshold = 150;
    const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 12;
    const total = Math.max(0, subtotal - discount + shippingFee);

    res.json({
      success: true,
      data: {
        items: formattedItems,
        subtotal,
        discount,
        shippingFee,
        total,
        giftPackaging: cart.giftPackaging,
        appliedCoupon: cart.appliedCoupon,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId, size, color, quantity = 1 } = req.body;
    const userId = req.user?.id;
    const guestToken = (req.headers["x-guest-token"] as string) || `guest_${Date.now()}`;

    const product = mongoose.isValidObjectId(productId)
      ? await Product.findById(productId)
      : await Product.findOne({ slug: productId });
    if (!product || !product.isPublished) {
      res.status(404).json({ success: false, message: "Product is not available." });
      return;
    }

    if (product.stock < quantity) {
      res
        .status(400)
        .json({ success: false, message: "Requested quantity exceeds available atelier stock." });
      return;
    }

    const query = userId ? { userId } : { guestToken };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        ...query,
        items: [{ productId: product._id, size, color, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (i) => String(i.productId) === String(product._id) && i.size === size && i.color === color,
      );

      if (existingItem) {
        existingItem.quantity = Math.min(product.stock, existingItem.quantity + quantity);
      } else {
        cart.items.push({ productId: product._id, size, color, quantity });
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: `${product.name} added to bag.`,
      guestToken: !userId ? guestToken : undefined,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { productId, size, color, quantity } = req.body;
    const userId = req.user?.id;
    const guestToken = req.headers["x-guest-token"] as string;

    const query = userId ? { userId } : { guestToken };
    const cart = await Cart.findOne(query);

    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found." });
      return;
    }

    const product = mongoose.isValidObjectId(productId)
      ? await Product.findById(productId)
      : await Product.findOne({ slug: productId });
    const targetIdStr = product ? String(product._id) : productId;

    const item = cart.items.find(
      (i) =>
        (String(i.productId) === targetIdStr || String(i.productId) === productId) &&
        i.size === size &&
        i.color === color,
    );

    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter((i) => i !== item);
      } else {
        item.quantity = Math.min(20, quantity);
      }
      await cart.save();
    }

    res.json({ success: true, message: "Shopping bag updated." });
  } catch (err) {
    next(err);
  }
}

export async function removeCartItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { productId, size, color } = req.body;
    const userId = req.user?.id;
    const guestToken = req.headers["x-guest-token"] as string;

    const query = userId ? { userId } : { guestToken };
    const cart = await Cart.findOne(query);

    const product = mongoose.isValidObjectId(productId)
      ? await Product.findById(productId)
      : await Product.findOne({ slug: productId });
    const targetIdStr = product ? String(product._id) : productId;

    if (cart) {
      cart.items = cart.items.filter(
        (i) =>
          !(
            (String(i.productId) === targetIdStr || String(i.productId) === productId) &&
            i.size === size &&
            i.color === color
          ),
      );
      await cart.save();
    }

    res.json({ success: true, message: "Item removed from bag." });
  } catch (err) {
    next(err);
  }
}

export async function syncGuestCart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    const guestToken = req.headers["x-guest-token"] as string;

    if (!userId || !guestToken) {
      res.json({ success: true });
      return;
    }

    const guestCart = await Cart.findOne({ guestToken });
    if (guestCart && guestCart.items.length > 0) {
      const userCart = await Cart.findOne({ userId });
      if (!userCart) {
        guestCart.userId = new mongoose.Types.ObjectId(userId);
        guestCart.guestToken = undefined;
        await guestCart.save();
      } else {
        // Merge items
        for (const gItem of guestCart.items) {
          const existing = userCart.items.find(
            (u) =>
              String(u.productId) === String(gItem.productId) &&
              u.size === gItem.size &&
              u.color === gItem.color,
          );
          if (existing) {
            existing.quantity = Math.min(20, existing.quantity + gItem.quantity);
          } else {
            userCart.items.push(gItem);
          }
        }
        await userCart.save();
        await Cart.deleteOne({ _id: guestCart._id });
      }
    }

    res.json({ success: true, message: "Guest shopping bag merged." });
  } catch (err) {
    next(err);
  }
}
