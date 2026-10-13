import { Router } from "express";
import {
  getDashboardOverview,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  getAdminCustomers,
  getAdminCoupons,
  createCoupon,
  deleteCoupon,
  getAdminReviews,
  moderateReview,
} from "../controllers/adminController";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

// Protect all admin endpoints with authentication and ADMIN role verification
router.use(authenticate, requireRole("ADMIN"));

router.get("/dashboard", getDashboardOverview);

// Products
router.get("/products", getAdminProducts);
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Orders
router.get("/orders", getAdminOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

// Customers
router.get("/customers", getAdminCustomers);

// Coupons
router.get("/coupons", getAdminCoupons);
router.post("/coupons", createCoupon);
router.delete("/coupons/:id", deleteCoupon);

// Reviews
router.get("/reviews", getAdminReviews);
router.patch("/reviews/:id", moderateReview);

export default router;
