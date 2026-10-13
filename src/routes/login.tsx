import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreLayout } from "@/components/storefront";
import { authApi } from "@/lib/api";
import { useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Client Login | LUXE Atelier" },
      { name: "description", content: "Access your LUXE client account and order monographs." },
      { property: "og:title", content: "Client Login | LUXE Atelier" },
      {
        property: "og:description",
        content: "Access your LUXE client account and order monographs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { saveCustomer } = useStorefront();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.user) {
        toast.success(`Welcome back, ${res.user.name}.`);
        saveCustomer({
          name: res.user.name,
          email: res.user.email,
          tier: res.user.role === "ADMIN" ? "Atelier Director (Admin)" : "Luxe Privé",
        });

        if (res.user.role === "ADMIN") {
          void navigate({ to: "/admin" as never });
        } else {
          void navigate({ to: "/account" });
        }
      }
    } catch (err: unknown) {
      toast.error(
        (err as Error).message || "Invalid credentials. Please verify your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: "customer" | "admin") => {
    if (type === "admin") {
      setEmail("admin@atelier-luxe.com");
      setPassword("AdminPassword2026!");
    } else {
      setEmail("clara.moreau@atelier-luxe.com");
      setPassword("CustomerPassword2026!");
    }
  };

  return (
    <StoreLayout>
      <section className="page-width py-16 sm:py-24">
        <div className="mx-auto max-w-md border border-border/80 bg-card p-8 sm:p-10">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Client Portal
            </span>
            <h1 className="mt-2 font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              Sign In to Atelier
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Access your order monographs, address book, and curated favorites.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="login-email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clara@example.com"
                className="mt-2 h-11 rounded-none bg-background text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-foreground"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="mt-2 h-11 rounded-none bg-background text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.18em]"
            >
              {loading ? "Authenticating..." : "Sign In to Account"}
            </Button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 border-t border-border/60 pt-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Demonstration Credentials
            </p>
            <div className="mt-2 flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleFillDemo("customer")}
                className="h-8 rounded-none text-[10px]"
              >
                Customer Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleFillDemo("admin")}
                className="h-8 rounded-none text-[10px]"
              >
                Admin Demo
              </Button>
            </div>
          </div>

          <div className="mt-6 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
            Don&rsquo;t have an account yet?{" "}
            <Link
              to="/register"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Register here
            </Link>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
