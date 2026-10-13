import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryLinks, ProductGrid, SectionHeading, StoreLayout } from "@/components/storefront";
import { products } from "@/lib/storefront";
import heroImage from "@/assets/luxe-editorial-hero.jpg";
import homeImage from "@/assets/luxe-product-home.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LUXE Atelier — Thoughtful Design for Considered Living" },
      {
        name: "description",
        content:
          "Discover heirloom European linen, vegetable-tanned leather goods, and hand-thrown ceramics, crafted to be cherished.",
      },
      {
        property: "og:title",
        content: "LUXE Atelier — Thoughtful Design for Considered Living",
      },
      {
        property: "og:description",
        content:
          "Discover heirloom European linen, vegetable-tanned leather goods, and hand-thrown ceramics, crafted to be cherished.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filteredFeatured = products
    .filter((p) => selectedFilter === "All" || p.category === selectedFilter)
    .slice(0, 4);

  return (
    <StoreLayout>
      {/* Editorial Hero Section */}
      <section className="page-width py-4 sm:py-6">
        <div className="relative min-h-[520px] overflow-hidden bg-muted sm:min-h-[640px] lg:min-h-[720px]">
          <img
            src={heroImage}
            alt="European linen apparel in an architectural coastal villa"
            width={1536}
            height={1024}
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover object-[62%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/20 to-transparent" />

          <div className="relative flex min-h-[520px] max-w-[660px] flex-col justify-end px-6 pb-12 text-primary-foreground sm:min-h-[640px] sm:px-12 sm:pb-16 lg:min-h-[720px] lg:px-16">
            <div className="fade-up mb-4 inline-flex items-center gap-2 border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-[9px] uppercase tracking-[0.24em] backdrop-blur-xs">
              <Sparkles className="size-3 text-champagne" />
              <span>Autumn Monograph · 2026</span>
            </div>

            <h1 className="fade-up max-w-xl font-serif text-6xl font-light leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
              Make room
              <br />
              for the good.
            </h1>

            <p className="fade-up mt-5 max-w-md text-xs leading-6 text-primary-foreground/90 sm:text-sm">
              Considered pieces for everyday rituals, quiet mornings, and slow evenings. Pure linen,
              Tuscan leather, and hand-finished ceramics.
            </p>

            <div className="fade-up mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 border border-primary-foreground bg-primary-foreground px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground transition-all hover:bg-transparent hover:text-primary-foreground"
              >
                Explore The Edit <ArrowRight className="size-3.5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border-b border-primary-foreground/70 pb-1.5 text-[10px] uppercase tracking-[0.18em] text-primary-foreground transition-all hover:border-primary-foreground"
              >
                The Atelier Story
              </Link>
            </div>
          </div>

          <span className="absolute bottom-6 right-6 hidden text-[9px] uppercase tracking-[0.2em] text-primary-foreground/75 sm:inline">
            Normandy Certified Flax · Ref. 01/26
          </span>
        </div>
      </section>

      {/* Pillars of Craftsmanship Bar */}
      <section className="page-width py-8">
        <div className="grid grid-cols-2 gap-4 border-y border-border/70 py-6 sm:grid-cols-4 sm:gap-8">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-champagne" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-foreground">
                Ethical Sourcing
              </p>
              <p className="text-[11px] text-muted-foreground">Certified European flax & wool</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-champagne" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-foreground">
                Master Artisans
              </p>
              <p className="text-[11px] text-muted-foreground">Handmade in historic ateliers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 size-4 shrink-0 text-champagne" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-foreground">
                Express Delivery
              </p>
              <p className="text-[11px] text-muted-foreground">Complimentary over $150</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="mt-0.5 size-4 shrink-0 text-champagne" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-foreground">
                Thoughtful Returns
              </p>
              <p className="text-[11px] text-muted-foreground">30-day effortless guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="page-width py-12 sm:py-16">
        <SectionHeading
          eyebrow="Curated Departments"
          title="Designed for Every Ritual"
          description="Timeless garments, functional carryalls, and serene objects sculpted for your home."
        />
        <CategoryLinks />
      </section>

      {/* Curated Bestsellers with Category Pills */}
      <section className="page-width py-12 sm:py-16">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Most Coveted
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light tracking-tight sm:text-5xl">
              The Essential Edit
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5" aria-label="Category filters">
            {["All", "Clothing", "Bags", "Home", "Jewelry"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`border px-3.5 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                  selectedFilter === cat
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:border-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid items={filteredFeatured} />
      </section>

      {/* Editorial Campaign Banner: Objects with a Point of View */}
      <section className="page-width py-12 sm:py-16">
        <div className="grid overflow-hidden border border-border/60 bg-sand sm:grid-cols-2">
          <div className="flex flex-col items-start justify-center px-8 py-12 sm:px-14 sm:py-16 lg:px-16">
            <span className="mb-3 border border-border/80 bg-background/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Atelier Living Edition
            </span>
            <h2 className="font-serif text-4xl font-light leading-[1] sm:text-5xl lg:text-6xl">
              A home that feels
              <br />
              unmistakably yours.
            </h2>
            <p className="mt-5 max-w-sm text-xs leading-6 text-muted-foreground sm:text-sm">
              The tactile objects that ground your space. Wheel-thrown regional stoneware, botanical
              wax tapers, and heirloom Inner Mongolian cashmere throws.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-8 rounded-none border-foreground/50 bg-transparent px-6 text-[10px] uppercase tracking-[0.16em] hover:bg-foreground hover:text-background"
            >
              <Link to="/shop" search={{ category: "Home" } as never}>
                Explore Ceramics & Home <ArrowUpRight className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
          <div className="aspect-[4/3] overflow-hidden bg-muted sm:aspect-auto">
            <img
              src={homeImage}
              alt="Hand-thrown ceramic vase with linen textile background"
              width={1024}
              height={1280}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="page-width py-12 sm:py-16">
        <SectionHeading
          eyebrow="Fresh from the Studio"
          title="New Arrivals"
          description="The latest silhouettes in sandwashed mulberry silk, hammered gold vermeil, and blake-stitched footwear."
          link={{ label: "View All New", to: "/shop" }}
        />
        <ProductGrid
          items={products
            .filter((p) => p.badge === "New arrival" || p.badge === "Atelier Edition")
            .slice(0, 4)}
        />
      </section>

      {/* Editorial Accolades & Press */}
      <section className="border-y border-border/80 bg-sand/40 py-16 sm:py-24">
        <div className="page-width text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Critical Reception & Press
          </p>
          <div className="my-5 flex justify-center gap-1 text-champagne">
            <Star className="size-4 fill-current" />
            <Star className="size-4 fill-current" />
            <Star className="size-4 fill-current" />
            <Star className="size-4 fill-current" />
            <Star className="size-4 fill-current" />
          </div>
          <blockquote className="mx-auto max-w-3xl font-serif text-3xl font-light leading-snug tracking-tight sm:text-5xl">
            &ldquo;LUXE represents an unhurried, quietly profound kind of luxury. Every seam and
            vessel feels considered for generations.&rdquo;
          </blockquote>
          <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Architectural Digest · The Design Edit
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-border/60 pt-8 sm:grid-cols-4">
            <div className="text-center">
              <p className="font-serif text-2xl font-light">100%</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Certified Natural Fibers
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl font-light">36h</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Wood Kiln Ceramic Firing
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl font-light">Porto & Florence</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Artisan Family Ateliers
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl font-light">Carbon Zero</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Offset Courier Packaging
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Editorial Call to Action */}
      <section className="page-width flex flex-col items-center py-20 text-center sm:py-28">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Begin Your Collection
        </span>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-tight sm:text-6xl">
          Designed for longevity.
          <br />
          Cherished for life.
        </h2>
        <p className="mt-4 max-w-md text-xs leading-6 text-muted-foreground sm:text-sm">
          Complimentary express delivery and bespoke wax-sealed packaging on all orders over $150.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-3 border border-foreground bg-foreground px-8 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-background transition-all hover:bg-background hover:text-foreground"
        >
          Discover The Entire Edit <ArrowRight className="size-3.5" />
        </Link>
      </section>
    </StoreLayout>
  );
}
