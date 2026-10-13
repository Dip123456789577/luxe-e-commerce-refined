import { createFileRoute } from "@tanstack/react-router";
import { StoreLayout } from "@/components/storefront";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | LUXE Atelier" },
      {
        name: "description",
        content: "Terms of service, craftsmanship guarantees, and client agreements.",
      },
      { property: "og:title", content: "Terms of Service | LUXE Atelier" },
      {
        property: "og:description",
        content: "Terms of service, craftsmanship guarantees, and client agreements.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <StoreLayout>
      <section className="page-width py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Legal & Governance
          </span>
          <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Terms of Acquisition & Service
          </h1>
          <p className="mt-4 text-xs text-muted-foreground">
            Effective as of October 2026 · LUXE Maison d’Artisan S.A.
          </p>

          <div className="mt-12 space-y-8 text-xs leading-relaxed text-muted-foreground">
            <section>
              <h2 className="font-serif text-xl font-normal text-foreground">
                1. Acquisition Agreement
              </h2>
              <p className="mt-2">
                By completing an order through the LUXE atelier digital storefront, you commission
                our master artisans to fulfill and deliver designated pieces under the conditions
                set forth in this agreement. Orders are officially confirmed upon transmission of
                your digital order monograph and unique order identifier (LX-XXXXXX).
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-normal text-foreground">
                2. Authentic Materials & Handcrafted Variations
              </h2>
              <p className="mt-2">
                Because our pieces are handcrafted using unadulterated vegetable-tanned Tuscan
                leathers, organic Normandy flax, and kiln-fired regional clay, subtle variations in
                grain texture, mineral flecks, and natural patinas are hallmarks of authentic
                atelier provenance, not defects.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-normal text-foreground">
                3. Pricing & Currency Integrity
              </h2>
              <p className="mt-2">
                All prices are expressed in United States Dollars ($ USD) unless explicitly toggled
                in regional currency views. Applicable import duties and regional luxury excise
                taxes are calculated transparently prior to payment confirmation.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-normal text-foreground">
                4. Two-Year Atelier Warranty
              </h2>
              <p className="mt-2">
                Every acquisition is protected by our complimentary two-year craftsmanship warranty,
                covering hardware recalibration, stitching reinforcements, and burnished edge
                refreshes performed at our European workshops.
              </p>
            </section>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
