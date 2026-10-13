import { useState, useEffect, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PackageCheck,
  User,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Heart,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreLayout } from "@/components/storefront";
import { money, products, useStorefront, type Order as StoreOrder } from "@/lib/storefront";
import { authApi, ordersApi, type ApiResponse } from "@/lib/api";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Client Portal & Order History | LUXE Atelier" },
      {
        name: "description",
        content: "Review your LUXE orders, client status, and personal details.",
      },
      { property: "og:title", content: "Client Portal & Order History | LUXE Atelier" },
      {
        property: "og:description",
        content: "Review your LUXE orders, client status, and personal details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { customer, saveCustomer, orders: localOrders, wishlist } = useStorefront();
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");

  const [name, setName] = useState(customer?.name ?? "Clara Moreau");
  const [email, setEmail] = useState(customer?.email ?? "clara.moreau@atelier-luxe.com");
  const [phone, setPhone] = useState(customer?.phone ?? "+1 (212) 555-0198");
  const [address, setAddress] = useState(
    customer?.shippingAddress ?? "740 Park Avenue, Apt 11B, New York, NY 10021",
  );
  const [serverOrders, setServerOrders] = useState<StoreOrder[]>([]);

  useEffect(() => {
    async function loadAccountData() {
      try {
        const [meRes, ordRes] = await Promise.all([
          authApi.getMe().catch((): ApiResponse => ({ success: false })),
          ordersApi.getMyOrders().catch((): ApiResponse => ({ success: false })),
        ]);

        if (meRes.success && meRes.user) {
          const u = meRes.user as {
            name?: string;
            email?: string;
            phone?: string;
            addresses?: Array<{ street: string; city: string; state: string; postalCode: string }>;
          };
          if (u.name) setName(u.name);
          if (u.email) setEmail(u.email);
          if (u.phone) setPhone(u.phone);
          if (u.addresses?.[0]) {
            setAddress(
              `${u.addresses[0].street}, ${u.addresses[0].city}, ${u.addresses[0].state} ${u.addresses[0].postalCode}`,
            );
          }
        }

        if (ordRes.success && Array.isArray(ordRes.data)) {
          const mapped: StoreOrder[] = (
            ordRes.data as Array<{
              orderNumber: string;
              total: number;
              customerEmail: string;
              fulfillmentStatus: string;
              shippingAddress?: { city?: string };
              shippingMethod?: string;
              items?: unknown[];
              createdAt: string;
            }>
          ).map((o) => ({
            number: o.orderNumber,
            date: new Date(o.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            total: o.total,
            email: o.customerEmail,
            itemsCount: o.items?.length ?? 1,
            status: (o.fulfillmentStatus === "CONFIRMED"
              ? "Confirmed"
              : o.fulfillmentStatus === "DISPATCHED"
                ? "Dispatched"
                : o.fulfillmentStatus === "DELIVERED"
                  ? "Delivered"
                  : "Preparing in Atelier") as StoreOrder["status"],
            city: o.shippingAddress?.city,
            shippingMethod: o.shippingMethod,
          }));
          setServerOrders(mapped);
        }
      } catch (err) {
        console.warn("Account live sync warning:", err);
      }
    }
    void loadAccountData();
  }, []);

  const orders = serverOrders.length > 0 ? serverOrders : localOrders;

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    saveCustomer({ name, email, phone, shippingAddress: address });
    toast.success("Client profile updated successfully.");
  };

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <StoreLayout>
      <section className="page-width pb-24 pt-8 sm:pb-32 sm:pt-12">
        {/* Profile Card Header */}
        <div className="border border-border/80 bg-card p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-full bg-secondary font-serif text-2xl font-light text-foreground">
                {name.charAt(0) || "C"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                    {name}
                  </h1>
                  <span className="inline-flex items-center gap-1 border border-border bg-sand px-2 py-0.5 text-[9px] uppercase tracking-wider text-foreground">
                    <Sparkles className="size-3 text-champagne" /> {customer?.tier ?? "Luxe Privé"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 border-t border-border/50 pt-4 text-xs text-muted-foreground sm:border-t-0 sm:pt-0">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                  Saved Orders
                </span>
                <span className="font-serif text-lg font-medium text-foreground">
                  {orders.length}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                  Saved Favorites
                </span>
                <span className="font-serif text-lg font-medium text-foreground">
                  {wishlist.length}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                  Courier Privilege
                </span>
                <span className="font-serif text-sm font-medium text-emerald-800">
                  Complimentary
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Security Note */}
        <div className="mt-4 border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mr-1.5 inline size-3.5 text-champagne" />
          <span>
            Demonstration Client Portal · Session state preserved on this browser. No external login
            backend required.
          </span>
        </div>

        {/* Tabs Bar */}
        <div className="mt-8 flex gap-2 border-b border-border/70 pb-px">
          {[
            { id: "orders", label: `Order History (${orders.length})`, icon: PackageCheck },
            { id: "profile", label: "Client Details", icon: User },
            { id: "addresses", label: "Address Book", icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as never)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? "border-foreground font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="pt-8">
            {orders.length === 0 ? (
              <div className="border border-border/60 bg-card py-16 text-center">
                <PackageCheck className="mx-auto size-12 stroke-[1] text-muted-foreground/50" />
                <h3 className="mt-4 font-serif text-2xl font-light">No order monographs yet</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  When you acquire pieces through the checkout simulation, they will appear here.
                </p>
                <Button asChild className="mt-6 rounded-none text-xs uppercase tracking-wider">
                  <Link to="/shop">Explore The Collection</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.number}
                    className="border border-border/70 bg-card p-6 transition-all hover:border-foreground/50"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-medium text-foreground">
                            {ord.number}
                          </span>
                          <span className="border border-border bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground">
                            {ord.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Placed on {ord.date} ·{" "}
                          {ord.city ? `Destination: ${ord.city}` : "Atelier Courier"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-serif text-xl font-light text-foreground">
                          {money(ord.total)}
                        </span>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="rounded-none text-[10px] uppercase tracking-wider"
                        >
                          <Link to="/order-confirmation/$orderId" params={{ orderId: ord.number }}>
                            View Receipt <ArrowRight className="ml-1 size-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === "profile" && (
          <div className="max-w-xl pt-8">
            <form
              onSubmit={handleSaveProfile}
              className="space-y-5 border border-border/70 bg-card p-6 sm:p-8"
            >
              <h2 className="font-serif text-2xl font-light text-foreground">Client Details</h2>
              <div>
                <label className="block text-xs font-medium text-foreground">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 h-11 rounded-none bg-background text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-11 rounded-none bg-background text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">Mobile Phone</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 h-11 rounded-none bg-background text-xs"
                />
              </div>
              <Button
                type="submit"
                className="h-11 rounded-none text-[10px] uppercase tracking-[0.16em]"
              >
                Save Profile Changes
              </Button>
            </form>
          </div>
        )}

        {/* Tab 3: Address Book */}
        {activeTab === "addresses" && (
          <div className="max-w-xl pt-8">
            <div className="border border-border/70 bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-light text-foreground">
                  Default Residence
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-emerald-800">
                  Primary ✓
                </span>
              </div>
              <p className="mt-3 text-xs leading-6 text-foreground font-medium">{name}</p>
              <p className="text-xs leading-6 text-muted-foreground">{address}</p>
              <p className="text-xs leading-6 text-muted-foreground">{phone}</p>
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none text-[10px] uppercase tracking-wider"
                  onClick={() => toast.message("Editing demo address in client storage.")}
                >
                  Edit Address
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Favorites quick bar */}
        {savedProducts.length > 0 && (
          <div className="mt-16 border-t border-border/70 pt-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-light">
                Saved Curation ({savedProducts.length})
              </h2>
              <Link to="/wishlist" className="text-xs uppercase tracking-wider underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {savedProducts.slice(0, 4).map((p) => (
                <Link key={p.id} to="/product/$slug" params={{ slug: p.id }} className="group">
                  <div className="aspect-[4/5] overflow-hidden bg-muted">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium group-hover:underline">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{money(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </StoreLayout>
  );
}
