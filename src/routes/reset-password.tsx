import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreLayout } from "@/components/storefront";
import { authApi } from "@/lib/api";

type ResetPasswordSearchParams = {
  token?: string | undefined;
};

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearchParams => ({
    token: typeof search["token"] === "string" ? search["token"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Set New Password | LUXE Atelier" },
      { name: "description", content: "Establish new access credentials for your LUXE account." },
      { property: "og:title", content: "Set New Password | LUXE Atelier" },
      {
        property: "og:description",
        content: "Establish new access credentials for your LUXE account.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token: initialToken } = Route.useSearch();
  const navigate = useNavigate();

  const [token, setToken] = useState(initialToken ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password entries do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters with letters, numbers, and symbols.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ token, password, confirmPassword });
      setCompleted(true);
      toast.success("Password reset successfully. You may now sign in.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to reset password. Token may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoreLayout>
      <section className="page-width py-16 sm:py-24">
        <div className="mx-auto max-w-md border border-border/80 bg-card p-8 sm:p-10">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Security Concierge
            </span>
            <h1 className="mt-2 font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              New Password
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Define a secure passphrase for your atelier monograph access.
            </p>
          </div>

          {completed ? (
            <div className="mt-8 space-y-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                <Check className="size-6 stroke-[1.5]" />
              </div>
              <p className="text-xs text-muted-foreground">
                Your credentials have been securely updated.
              </p>
              <Button
                type="button"
                onClick={() => void navigate({ to: "/login" })}
                className="h-12 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.18em]"
              >
                Sign In to Account
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="reset-token" className="block text-xs font-medium text-foreground">
                  Verification Token
                </label>
                <Input
                  id="reset-token"
                  required
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste reset token here"
                  className="mt-2 h-11 rounded-none bg-background font-mono text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="reset-new-password"
                  className="block text-xs font-medium text-foreground"
                >
                  New Password
                </label>
                <Input
                  id="reset-new-password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-2 h-11 rounded-none bg-background text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="reset-confirm-password"
                  className="block text-xs font-medium text-foreground"
                >
                  Confirm New Password
                </label>
                <Input
                  id="reset-confirm-password"
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-2 h-11 rounded-none bg-background text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.18em]"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  <ArrowLeft className="size-3.5" /> Return to Client Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </StoreLayout>
  );
}
