import { Request, Response, NextFunction } from "express";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Review } from "../models/Review";

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "20"), 10)));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { isPublished: true };

    // Category filter
    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }

    // Keyword search
    if (req.query.q) {
      const q = String(req.query.q).trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { subtitle: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Price range
    const minPrice = req.query.minPrice ? parseFloat(String(req.query.minPrice)) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(String(req.query.maxPrice)) : undefined;

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) (filter.price as Record<string, number>).$gte = minPrice;
      if (maxPrice !== undefined) (filter.price as Record<string, number>).$lte = maxPrice;
    }

    // Sorting
    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (req.query.sort === "price-low") sort = { price: 1 };
    else if (req.query.sort === "price-high") sort = { price: -1 };
    else if (req.query.sort === "top-rated") sort = { rating: -1 };
    else if (req.query.sort === "featured") sort = { featured: -1, createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({
      $or: [{ slug }, { sku: slug }],
      isPublished: true,
    });

    if (!product) {
      res.status(404).json({ success: false, message: "Product piece not found." });
      return;
    }

    // Retrieve approved customer reviews
    const reviews = await Review.find({ productId: product._id, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: product,
      reviews,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
}

export async function createProductReview(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const { rating, title, comment, customerName } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }

    const review = await Review.create({
      productId: product._id,
      userId: req.user?.id,
      customerName: customerName || req.user?.name || "Client",
      rating: Math.min(5, Math.max(1, rating)),
      title,
      comment,
      verifiedPurchase: true,
      isApproved: true,
    });

    // Update product rating aggregate
    const allReviews = await Review.find({ productId: product._id, isApproved: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

    product.rating = Math.round(avgRating * 10) / 10;
    product.reviewsCount = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: "Review recorded.",
      data: review,
    });
  } catch (err) {
    next(err);
  }
}
