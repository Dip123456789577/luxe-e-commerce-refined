import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { connectDB, disconnectDB } from "../config/db";

async function bootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL || process.argv[2] || "admin@atelier-luxe.com";
  const password = process.env.ADMIN_PASSWORD || process.argv[3] || "AdminPassword2026!";
  const name = process.env.ADMIN_NAME || "Atelier Master Administrator";

  console.log(`[Bootstrap] Bootstrapping administrator: ${email}`);

  await connectDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    {
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "ADMIN",
      isActive: true,
      isEmailVerified: true,
    },
    { upsert: true, new: true },
  );

  console.log(
    `[Bootstrap] Administrator successfully configured: ${admin.email} (Role: ${admin.role})`,
  );
  await disconnectDB();
  process.exit(0);
}

void bootstrapAdmin();
