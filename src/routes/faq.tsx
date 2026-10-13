import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { StoreLayout } from "@/components/storefront";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Addressed Inquiries | LUXE Atelier" },
      {
        name: "description",
        content:
          "Clear answers regarding LUXE ordering, worldwide complimentary shipping, returns, and material care.",
      },
      { property: "og:title", content: "Frequently Addressed Inquiries | LUXE Atelier" },
      {
        property: "og:description",
        content:
          "Clear answers regarding LUXE ordering, worldwide complimentary shipping, returns, and material care.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FAQPage,
});

const faqItems = [
  {
    category: "Ordering & Shipping",
    q: "How does complimentary shipping operate?",
    a: "All orders totaling $150 or greater receive complimentary carbon-neutral express courier delivery worldwide. Orders below $150 are delivered via standard insured courier for a flat fee of $12.",
  },
  {
    category: "Ordering & Shipping",
    q: "How long does atelier dispatch take?",
    a: "Pieces currently in stock are dispatched within 24 to 48 hours from our European fulfillment centers. Delivery typically takes 2–4 business days depending on destination country.",
  },
  {
    category: "Returns & Exchanges",
    q: "What is the return policy?",
    a: "We offer a 30-day return window from the date of package delivery. Items must remain unwashed, unworn, and with their original atelier labels and packaging intact. Complimentary return shipping labels are provided.",
  },
  {
    category: "Returns & Exchanges",
    q: "Can I exchange for an alternate size or tone?",
    a: "Yes. Simply contact our concierge team or specify your desired replacement size on your return documentation; we will hold and dispatch the requested piece upon dispatch notification.",
  },
  {
    category: "Materials & Craftsmanship",
    q: "Where are LUXE textiles sourced and woven?",
    a: "Our linen is woven exclusively from European Masters of Linen certified flax cultivated in Normandy. Knits are spun from traceable Australian extra-fine merino wool in Biella, Italy.",
  },
  {
    category: "Materials & Craftsmanship",
    q: "How should I care for vegetable-tanned leather?",
    a: "Vegetable-tanned leather is a living material that absorbs the memories of wear, deepening into a rich honeyed patina. Avoid direct prolonged moisture, and condition lightly twice a year with natural organic beeswax balm.",
  },
  {
    category: "Gifting & Packaging",
    q: "Is gift wrapping available?",
    a: "Yes. Every order includes the option for complimentary embossed gift boxes wrapped in recycled linen ribbons and sealed with our signature metallic seal at checkout.",
  },
];

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    "All",
    "Ordering & Shipping",
    "Returns & Exchanges",
    "Materials & Craftsmanship",
    "Gifting & Packaging",
  ];

  const filtered = faqItems.filter(
    (item) => activeCategory === "All" || item.category === activeCategory,
  );

  return (
    <StoreLayout>
      <section className="page-width pb-24 pt-10 sm:pb-32 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Knowledge & Care
          </p>
          <h1 className="mt-3 font-serif text-5xl font-light tracking-tight text-foreground sm:text-6xl">
            Frequently Answered
          </h1>
          <p className="mt-4 text-xs leading-6 text-muted-foreground sm:text-sm">
            Everything you need to know regarding delivery schedules, atelier sizing, sustainable
            materials, and our 30-day guarantee.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`border px-4 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                activeCategory === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border/70 border-y border-border/70">
          {filtered.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-2">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between py-4 text-left font-serif text-xl font-normal text-foreground transition-colors hover:text-muted-foreground"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-5 text-xs leading-6 text-muted-foreground">
                    <p>{item.a}</p>
                    <span className="mt-2 inline-block text-[9px] uppercase tracking-widest text-champagne">
                      Section: {item.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mx-auto mt-16 max-w-xl border border-border/80 bg-card p-8 text-center">
          <HelpCircle className="mx-auto size-6 text-champagne" />
          <h2 className="mt-3 font-serif text-2xl font-light">Have an unanswered question?</h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Our private client concierge in Paris and New York is available to assist with custom
            orders, fabric swatches, or urgent courier routing.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-[10px] uppercase tracking-[0.16em] text-background hover:bg-background hover:text-foreground"
          >
            Connect With Concierge <ArrowRight className="size-3" />
          </Link>
        </div>
      </section>
    </StoreLayout>
  );
}
