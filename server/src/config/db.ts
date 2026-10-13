import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ENV } from "./env";

let memoryServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  // If already connected, reuse connection
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  let uri = ENV.MONGODB_URI;

  if (!uri) {
    if (ENV.NODE_ENV !== "production") {
      console.log(
        "[MongoDB] No MONGODB_URI provided. Initializing in-memory MongoDB instance for development/testing...",
      );
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.log(`[MongoDB] In-memory MongoDB running at: ${uri}`);
    } else {
      throw new Error("MONGODB_URI environment variable is required in production mode.");
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log(`[MongoDB] Successfully connected to database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error("[MongoDB] Connection error:", err);
    throw err;
  }
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
  console.log("[MongoDB] Database connection closed.");
}
