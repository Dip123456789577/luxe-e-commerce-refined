import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreLayout } from "@/components/storefront";
import { authApi } from "@/lib/api";
import { useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Client Registration | LUXE Atelier" },
      { name: "description", content: "Create an account with LUXE Atelier." },
      { property: "og:title", content: "Client Registration | LUXE Atelier" },
      { property: "og:description", content: "Create an account with LUXE Atelier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { saveCustomer } = useStorefront();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password, confirmPassword });
      if (res.success && res.user) {
        toast.success("Welcome to LUXE Atelier. Your account has been registered.");
        saveCustomer({
          name: res.user.name,
          email: res.user.email,
          tier: "Luxe Privé",
        });
        void navigate({ to: "/account" });
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Registration failed. Please check your information.");
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
              New Acquisition Profile
            </span>
            <h1 className="mt-2 font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              Register Account
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Join the LUXE Atelier monograph for private previews and order records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="reg-name" className="block text-xs font-medium text-foreground">
                Full Name
              </label>
              <Input
                id="reg-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Margaux Moreau"
                className="mt-1.5 h-11 rounded-none bg-background text-xs"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="reg-email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="margaux@example.com"
                className="mt-1.5 h-11 rounded-none bg-background text-xs"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-medium text-foreground">
                Password (min. 6 characters)
              </label>
              <Input
                id="reg-password"
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1.5 h-11 rounded-none bg-background text-xs"
              />
            </div>

            <div>
              <label
                htmlFor="reg-confirm-password"
                className="block text-xs font-medium text-foreground"
              >
                Confirm Password
              </label>
              <Input
                id="reg-confirm-password"
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1.5 h-11 rounded-none bg-background text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.18em]"
            >
              {loading ? "Creating Profile..." : "Create Client Account"}
            </Button>
          </form>

          <div className="mt-6 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Sign in here
            </Link>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
