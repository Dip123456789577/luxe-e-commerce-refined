import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { User, UserRole } from "../models/User";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export function generateToken(user: {
  _id: unknown;
  email: string;
  role: UserRole;
  name: string;
}): string {
  const payload: JwtPayload = {
    id: String(user._id),
    email: user.email,
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function setAuthCookie(res: Response, token: string): void {
  const isProduction = ENV.NODE_ENV === "production";
  res.cookie("luxe_access_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  const isProduction = ENV.NODE_ENV === "production";
  res.clearCookie("luxe_access_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
  });
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token = req.cookies?.luxe_access_token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: "Authentication required. Please log in." });
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: "Account unavailable or disabled." });
      return;
    }

    req.user = {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired session. Please log in again." });
  }
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let token = req.cookies?.luxe_access_token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
      const user = await User.findById(decoded.id).select("-passwordHash");
      if (user && user.isActive) {
        req.user = {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ success: false, message: "Access forbidden. Administrator privileges required." });
      return;
    }

    next();
  };
}
