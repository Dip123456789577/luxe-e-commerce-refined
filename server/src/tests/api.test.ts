import { describe, expect, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { connectDB, disconnectDB } from "../config/db";
import { seedDatabase } from "../scripts/seed";
import { Product } from "../models/Product";

describe("Full-Stack Express & MongoDB API Test Suite", () => {
  const app = createApp();
  let customerToken = "";
  let adminToken = "";
  let sampleProductId = "";

  beforeAll(async () => {
    await connectDB();
    await seedDatabase();

    const sampleProduct = await Product.findOne();
    if (sampleProduct) {
      sampleProductId = String(sampleProduct._id);
    }
  }, 60000);

  afterAll(async () => {
    await disconnectDB();
  });

  it("GET /health - reports healthy service status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
  });

  describe("Authentication & Authorization Flow", () => {
    const testEmail = `test_${Date.now()}@example.com`;

    it("POST /api/v1/auth/register - registers a new customer", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Test Client",
        email: testEmail,
        password: "SecurePassword2026!",
        confirmPassword: "SecurePassword2026!",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testEmail);
      expect(res.body.user.role).toBe("CUSTOMER");
      expect(res.body.token).toBeTruthy();
      customerToken = res.body.token;
    });

    it("POST /api/v1/auth/register - rejects duplicate registration", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Duplicate Client",
        email: testEmail,
        password: "SecurePassword2026!",
        confirmPassword: "SecurePassword2026!",
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("POST /api/v1/auth/login - rejects invalid credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: testEmail,
        password: "WrongPassword!",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("POST /api/v1/auth/login - authenticates admin credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "admin@atelier-luxe.com",
        password: "AdminPassword2026!",
      });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe("ADMIN");
      adminToken = res.body.token;
    });

    it("GET /api/v1/auth/me - allows authenticated access to client profile", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testEmail);
    });
  });

  describe("Product Catalog API", () => {
    it("GET /api/v1/products - retrieves paginated products list", async () => {
      const res = await request(app).get("/api/v1/products?limit=10");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination.total).toBeGreaterThan(0);
    });

    it("GET /api/v1/products/:slug - retrieves individual product details", async () => {
      const res = await request(app).get("/api/v1/products/the-linen-dress");
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("The Linen Dress");
      expect(res.body.data.price).toBe(148);
    });
  });

  describe("Cart & Server-side Totals API", () => {
    const guestToken = "guest_test_token_123";

    it("POST /api/v1/cart/items - adds an item to cart with stock validation", async () => {
      const res = await request(app)
        .post("/api/v1/cart/items")
        .set("x-guest-token", guestToken)
        .send({
          productId: sampleProductId,
          size: "M",
          color: "Ivory",
          quantity: 2,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("GET /api/v1/cart - calculates subtotal securely on server", async () => {
      const res = await request(app).get("/api/v1/cart").set("x-guest-token", guestToken);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.subtotal).toBeGreaterThan(0);
    });
  });

  describe("Order Placement API", () => {
    it("POST /api/v1/orders - creates order with atomic inventory snapshot", async () => {
      const res = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          customerName: "Test Client",
          customerEmail: "testclient@example.com",
          items: [
            {
              productId: sampleProductId,
              size: "M",
              color: "Ivory",
              quantity: 1,
            },
          ],
          shippingAddress: {
            fullName: "Test Client",
            street: "123 Madison Ave",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "United States",
          },
          shippingMethod: "Standard Atelier Delivery",
          paymentProvider: "DEMO",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.orderNumber).toMatch(/^LX-\d+/);
      expect(res.body.data.paymentStatus).toBe("PAID");
    });
  });

  describe("Role-Based Access Control (RBAC)", () => {
    it("GET /api/v1/admin/dashboard - rejects customer with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/v1/admin/dashboard")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("GET /api/v1/admin/dashboard - permits administrator with 200 OK", async () => {
      const res = await request(app)
        .get("/api/v1/admin/dashboard")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalOrders).toBeDefined();
    });
  });
});
