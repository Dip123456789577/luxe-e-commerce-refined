type ErrorContext = Record<string, unknown>;

export function reportAppError(error: unknown, context: ErrorContext = {}) {
  if (typeof window === "undefined") return;

  const message = error instanceof Error ? error.message : String(error);
  console.error("[LUXE Error Boundary]", message, {
    route: window.location.pathname,
    ...context,
  });
}
