import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { ENV } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows flexible integration in dev
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  // CORS Configuration
  app.use(
    cors({
      origin: [ENV.CLIENT_URL, "http://localhost:8080", "http://localhost:5173"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-guest-token"],
    }),
  );

  // Body Parsing & Cookies
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(cookieParser(ENV.COOKIE_SECRET));

  // Request Logging
  if (ENV.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // Rate Limiting
  app.use("/api/", apiLimiter);

  // Health Check
  app.get("/health", (_req, res) => {
    res.json({
      status: "healthy",
      service: "LUXE Atelier API",
      timestamp: new Date().toISOString(),
      environment: ENV.NODE_ENV,
    });
  });

  // REST API Endpoints (Version 1)
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/cart", cartRoutes);
  app.use("/api/v1/orders", orderRoutes);
  app.use("/api/v1/payments", paymentRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/admin", adminRoutes);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
