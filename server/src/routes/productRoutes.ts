import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  getCategories,
  createProductReview,
} from "../controllers/productController";
import { optionalAuth } from "../middleware/auth";

const router = Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:slug", getProductBySlug);
router.post("/:id/reviews", optionalAuth, createProductReview);

export default router;
