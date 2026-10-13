import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";
import { Wishlist } from "../models/Wishlist";
import { Product } from "../models/Product";

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }

    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }

    const { name } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    if (name) user.name = name.trim();
    await user.save();

    res.json({
      success: true,
      message: "Profile updated.",
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

export async function addAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added to address book.",
      data: user.addresses,
    });
  } catch (err) {
    next(err);
  }
}

export async function removeAddress(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }

    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    user.addresses = user.addresses.filter(
      (a) => String((a as { _id?: unknown })._id) !== addressId,
    );
    await user.save();

    res.json({
      success: true,
      message: "Address removed.",
      data: user.addresses,
    });
  } catch (err) {
    next(err);
  }
}

export async function getWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }

    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate("productIds");
    res.json({
      success: true,
      data: wishlist ? wishlist.productIds : [],
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleWishlist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }

    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({
        userId: new mongoose.Types.ObjectId(req.user.id),
        productIds: [product._id],
      });
    } else {
      const idx = wishlist.productIds.findIndex((id) => String(id) === String(product._id));
      if (idx > -1) {
        wishlist.productIds.splice(idx, 1);
      } else {
        wishlist.productIds.push(product._id as mongoose.Types.ObjectId);
      }
    }

    await wishlist.save();

    res.json({
      success: true,
      data: wishlist.productIds,
    });
  } catch (err) {
    next(err);
  }
}
