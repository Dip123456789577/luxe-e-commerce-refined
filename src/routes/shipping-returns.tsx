import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, RotateCcw, ShieldCheck, Clock, Globe } from "lucide-react";
import { StoreLayout } from "@/components/storefront";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & Complimentary Returns | LUXE Atelier" },
      {
        name: "description",
        content:
          "Worldwide insured dispatch, carbon-neutral logistics, and atelier returns policy.",
      },
      { property: "og:title", content: "Shipping & Complimentary Returns | LUXE Atelier" },
      {
        property: "og:description",
        content:
          "Worldwide insured dispatch, carbon-neutral logistics, and atelier returns policy.",
      },
    ],
  }),
  component: ShippingReturnsPage,
});

function ShippingReturnsPage() {
  return (
    <StoreLayout>
      <section className="page-width py-16 sm:py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Customer Concierge & Care
          </span>
          <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Dispatch & Atelier Returns
          </h1>
          <p className="mt-4 text-sm font-light text-muted-foreground sm:text-base">
            Every acquisition leaves our European ateliers encased in protective archival packaging,
            fully insured, and dispatched via carbon-offset priority couriers.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
          <div className="border border-border/80 bg-card p-8">
            <Truck className="size-6 stroke-[1.2] text-foreground" />
            <h3 className="mt-4 font-serif text-lg font-normal text-foreground">
              Complimentary Delivery
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Complimentary insured shipping on all orders exceeding $150. For smaller commissions,
              a flat delivery privilege of $12 applies worldwide.
            </p>
          </div>

          <div className="border border-border/80 bg-card p-8">
            <RotateCcw className="size-6 stroke-[1.2] text-foreground" />
            <h3 className="mt-4 font-serif text-lg font-normal text-foreground">
              30-Day Atelier Returns
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              If an acquisition does not meet your expectations, return it within 30 days in its
              original unworn state with security tags intact for a full refund.
            </p>
          </div>

          <div className="border border-border/80 bg-card p-8">
            <Globe className="size-6 stroke-[1.2] text-foreground" />
            <h3 className="mt-4 font-serif text-lg font-normal text-foreground">
              Carbon-Neutral Transit
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              100% of transport emissions are balanced through verified forestry conservation in the
              Caledonian Highlands.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="mx-auto mt-16 max-w-3xl space-y-12 divide-y divide-border/60">
          <div className="pt-8">
            <h2 className="font-serif text-2xl font-light text-foreground">
              1. Delivery Horizons & Rates
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-3">Destination</th>
                    <th className="py-3">Method</th>
                    <th className="py-3">Timeline</th>
                    <th className="py-3">Privilege</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  <tr>
                    <td className="py-3 font-medium text-foreground">North America</td>
                    <td className="py-3">Express Air Courier</td>
                    <td className="py-3">2–4 business days</td>
                    <td className="py-3">$25 or Free over $150</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-foreground">European Union & UK</td>
                    <td className="py-3">Ground Atelier Transit</td>
                    <td className="py-3">1–3 business days</td>
                    <td className="py-3">Complimentary</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-foreground">
                      Asia-Pacific & Rest of World
                    </td>
                    <td className="py-3">Insured Global Flight</td>
                    <td className="py-3">3–6 business days</td>
                    <td className="py-3">$35 or Free over $250</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-8">
            <h2 className="font-serif text-2xl font-light text-foreground">
              2. How to Initiate a Return
            </h2>
            <ol className="mt-4 list-decimal space-y-3 pl-4 text-xs leading-relaxed text-muted-foreground">
              <li>
                Access your{" "}
                <Link to="/account" className="text-foreground underline underline-offset-4">
                  Client Portal
                </Link>{" "}
                or write to concierge@atelier-luxe.com with your order number (e.g. LX-102948).
              </li>
              <li>
                Download and print the pre-paid digital return bill of lading provided by our
                concierge.
              </li>
              <li>
                Repackage the item inside its archival cloth dust bag and outer carton, adhering the
                return label on top.
              </li>
              <li>
                Schedule a complimentary courier doorstep collection or hand over at any authorized
                courier depot.
              </li>
            </ol>
          </div>

          <div className="pt-8">
            <h2 className="font-serif text-2xl font-light text-foreground">
              3. Bespoke & Made-to-Measure Exceptions
            </h2>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Pieces commissioned with monogram engraving, bespoke tailoring, or special sizing are
              hand-crafted exclusively for your specifications and cannot be refunded unless an
              inherent material defect is determined by our head quality conservator.
            </p>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
