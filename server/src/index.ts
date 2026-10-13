import { createApp } from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";
import { seedDatabase } from "./scripts/seed";
import { Product } from "./models/Product";

async function startServer() {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log(
        "[Seed] Database empty. Seeding initial luxury products, categories, and accounts...",
      );
      await seedDatabase();
    }

    const app = createApp();
    const server = app.listen(ENV.PORT, () => {
      console.log(`\n==================================================`);
      console.log(`💎 LUXE Atelier API Server Running`);
      console.log(`📡 URL: http://localhost:${ENV.PORT}`);
      console.log(`🌍 Health: http://localhost:${ENV.PORT}/health`);
      console.log(`🛡️ Environment: ${ENV.NODE_ENV}`);
      console.log(`==================================================\n`);
    });

    const shutdown = async () => {
      console.log("\n[Server] Gracefully terminating server...");
      server.close(() => {
        console.log("[Server] HTTP listener closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("[Fatal] Failed to launch server:", err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  void startServer();
}
