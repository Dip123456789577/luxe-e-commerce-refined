import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreLayout } from "@/components/storefront";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password | LUXE Atelier" },
      { name: "description", content: "Recover your LUXE client credentials." },
      { property: "og:title", content: "Forgot Password | LUXE Atelier" },
      { property: "og:description", content: "Recover your LUXE client credentials." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.forgotPassword(email);
      setSubmitted(true);
      if (res.resetToken) {
        setDevToken(String(res.resetToken));
      }
      toast.success("Password recovery instructions dispatched.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Unable to process password reset request.");
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
              Reset Password
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Provide your client email to receive a secure atelier recovery token.
            </p>
          </div>

          {submitted ? (
            <div className="mt-8 space-y-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                <Check className="size-6 stroke-[1.5]" />
              </div>
              <p className="text-xs text-muted-foreground">
                We have transmitted recovery instructions to{" "}
                <span className="font-medium text-foreground">{email}</span>. Please verify your
                inbox.
              </p>

              {devToken && (
                <div className="border border-border/80 bg-sand/40 p-4 text-left">
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                    Development Reset Link
                  </span>
                  <Link
                    to="/reset-password"
                    search={{ token: devToken }}
                    className="mt-1 block break-all font-mono text-[11px] text-foreground underline underline-offset-4"
                  >
                    Click to Reset Password with Token
                  </Link>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-foreground underline underline-offset-4 hover:text-champagne"
                >
                  <ArrowLeft className="size-3.5" /> Return to Client Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="forgot-email" className="block text-xs font-medium text-foreground">
                  Client Email Address
                </label>
                <div className="relative mt-2">
                  <Input
                    id="forgot-email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="clara.moreau@atelier-luxe.com"
                    className="h-11 rounded-none bg-background pr-9 text-xs"
                  />
                  <Mail className="absolute right-3 top-3 size-4 text-muted-foreground/60" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.18em]"
              >
                {loading ? "Transmitting..." : "Send Reset Instructions"}
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
