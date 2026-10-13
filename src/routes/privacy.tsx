import { createFileRoute } from "@tanstack/react-router";
import { StoreLayout } from "@/components/storefront";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | LUXE Atelier" },
      {
        name: "description",
        content: "Client confidentiality and data governance standards at LUXE Maison.",
      },
      { property: "og:title", content: "Privacy Policy | LUXE Atelier" },
      {
        property: "og:description",
        content: "Client confidentiality and data governance standards at LUXE Maison.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <StoreLayout>
      <section className="page-width py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Legal & Governance
          </span>
          <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Privacy Charter & Data Integrity
          </h1>
          <p className="mt-4 text-xs text-muted-foreground">
            Effective as of October 2026 · LUXE Maison d’Artisan S.A.
          </p>

          <div className="mt-12 space-y-8 text-xs leading-relaxed text-muted-foreground">
            <section>
              <h2 className="font-serif text-xl font-normal text-foreground">
                1. Principle of Discrete Stewardship
              </h2>
              <p className="mt-2">
                At LUXE Maison, we treat client confidentiality with the highest degree of
                reverence. We never monetize, exchange, or lease your personal records, purchasing
                history, or browsing behaviors to third-party data broker networks.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-normal text-foreground">
                2. Data Collected for Commission Fulfillment
              </h2>
              <p className="mt-2">
                To handcraft, dispatch, and guarantee your acquisitions, we securely capture:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Contact credentials (name, email address, telephone contact)</li>
                <li>Delivery coordinates and billing addresses</li>
                <li>
                  Encrypted transaction tokens (card payment processing handled through PCI-DSS
                  Level 1 vaults)
                </li>
                <li>Sizing and craftsmanship customization notes</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-normal text-foreground">
                3. Encryption & Access Architecture
              </h2>
              <p className="mt-2">
                All client interaction is transported over TLS 1.3 protocol. Sensitive credentials
                such as client passphrases are salted with 12 rounds of bcrypt before persistent
                database entry. JWT credentials utilize cryptographic signing and HttpOnly storage
                attributes.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-normal text-foreground">
                4. Your Rights Under GDPR & CCPA
              </h2>
              <p className="mt-2">
                You maintain sovereign authority over your digital footprint. At any time, you may
                request complete export of your personal monographs, rectification of address
                records, or complete irreversible deletion from our records by directing an inquiry
                to <span className="font-medium text-foreground">privacy@atelier-luxe.com</span>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
