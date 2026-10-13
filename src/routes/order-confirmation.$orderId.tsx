import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, PackageCheck, Truck, ShieldCheck, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreLayout } from "@/components/storefront";
import { money, useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.orderId} Confirmed | LUXE Atelier` },
      { name: "description", content: "Your LUXE demo order confirmation and summary." },
      { property: "og:title", content: `Order ${params.orderId} Confirmed | LUXE Atelier` },
      { property: "og:description", content: "Your LUXE demo order confirmation and summary." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { orderId } = Route.useParams();
  const { orders } = useStorefront();
  const order = orders.find((item) => item.number === orderId);

  return (
    <StoreLayout>
      <section className="page-width min-h-[60vh] py-16 sm:py-24">
        <div className="mx-auto max-w-2xl border border-border/80 bg-card p-8 sm:p-12 text-center">
          {/* Success Check Icon */}
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-secondary/80 text-foreground">
            <Check className="size-8 stroke-[1.5]" />
          </div>

          <p className="mt-6 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Atelier Order Monograph
          </p>
          <h1 className="mt-2 font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Your acquisition is confirmed.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-muted-foreground sm:text-sm">
            Thank you for choosing considered design. A simulated dispatch notification has been
            filed under your client profile on this device.
          </p>

          {order ? (
            <div className="mt-8 border-y border-border/70 py-6 text-left text-xs">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-border/50">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Order Reference
                  </span>
                  <p className="mt-1 font-mono text-sm font-medium text-foreground">
                    {order.number}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Date Placed
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">{order.date}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Client Contact
                  </span>
                  <p className="mt-1 truncate text-xs text-foreground">{order.email}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Total Acquisition
                  </span>
                  <p className="mt-1 font-serif text-lg font-medium text-foreground">
                    {money(order.total)}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="pt-6">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Fulfillment Status
                </span>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <span className="size-2 rounded-full bg-emerald-600" />
                    <span>Confirmed</span>
                  </div>
                  <span className="h-px flex-1 mx-3 bg-border" />
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <PackageCheck className="size-3.5" />
                    <span>Atelier Assembly</span>
                  </div>
                  <span className="h-px flex-1 mx-3 bg-border" />
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Truck className="size-3.5" />
                    <span>Courier Dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground">
              Order {orderId} is registered in your browser storage.
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="h-11 rounded-none px-6 text-[10px] uppercase tracking-[0.18em]"
            >
              <Link to="/shop">Continue Exploring Collection</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-none px-6 text-[10px] uppercase tracking-[0.18em]"
            >
              <Link to="/account">View in Client Portal</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 rounded-none text-[10px] uppercase tracking-[0.18em]"
              onClick={() => window.print()}
            >
              <Printer className="mr-1.5 size-3.5" /> Print Monograph
            </Button>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-champagne" />
            Demonstration record · No live financial transfer took place
          </p>
        </div>
      </section>
    </StoreLayout>
  );
}
