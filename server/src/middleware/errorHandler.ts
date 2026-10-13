import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  errors?: unknown;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  // Mongoose duplicate key error (code 11000)
  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: "A record with the specified unique field already exists.",
    });
    return;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: "Database schema validation failed.",
      error: err.message,
    });
    return;
  }

  // CastError (e.g. invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid resource identifier format.",
    });
    return;
  }

  console.error("[Server Error]", err);

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected internal server error occurred.",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
}
