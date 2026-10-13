import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { StoreLayout } from "@/components/storefront";
import heroImage from "@/assets/luxe-editorial-hero.jpg";
import homeImage from "@/assets/luxe-product-home.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Atelier Story & Philosophy | LUXE" },
      {
        name: "description",
        content:
          "Discover the philosophy, master artisans, and sustainable craftsmanship behind LUXE Atelier.",
      },
      { property: "og:title", content: "The Atelier Story & Philosophy | LUXE" },
      {
        property: "og:description",
        content:
          "Discover the philosophy, master artisans, and sustainable craftsmanship behind LUXE Atelier.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <StoreLayout>
      {/* Editorial Intro */}
      <section className="page-width py-12 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            The Atelier Monograph
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light leading-[1.05] tracking-tight sm:text-7xl">
            A quiet rebellion
            <br />
            against the disposable.
          </h1>
          <p className="mt-6 text-sm leading-7 text-muted-foreground sm:text-base">
            LUXE was founded on a singular conviction: that the objects with which we inhabit our
            days should possess tactile weight, deliberate provenance, and an enduring sense of
            calm.
          </p>
        </div>
      </section>

      {/* Large Visual Spread */}
      <section className="page-width pb-16 sm:pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={heroImage}
              alt="Artisan handling raw Normandy flax textile"
              className="size-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={homeImage}
              alt="Sculpted ceramic stoneware in kiln studio"
              className="size-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="border-y border-border/80 bg-sand/40 py-16 sm:py-24">
        <div className="page-width">
          <div className="mb-12 text-center">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Guiding Principles
            </span>
            <h2 className="mt-2 font-serif text-3xl font-light sm:text-5xl">Our Triad of Craft</h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <div className="border border-border/60 bg-card p-8">
              <span className="font-serif text-3xl font-light text-champagne">01</span>
              <h3 className="mt-4 font-serif text-2xl font-light">Traceable Provenance</h3>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                From organic flax fields along the French coast to vegetable-tannery riverbeds in
                Tuscany, we trace every fiber, skin, and mineral to its geographical origin.
              </p>
            </div>

            <div className="border border-border/60 bg-card p-8">
              <span className="font-serif text-3xl font-light text-champagne">02</span>
              <h3 className="mt-4 font-serif text-2xl font-light">Master Kinship</h3>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                We do not outsource to anonymous industrial factories. We collaborate intimately
                with family-owned workshops in Portugal, Italy, Scotland, and Japan.
              </p>
            </div>

            <div className="border border-border/60 bg-card p-8">
              <span className="font-serif text-3xl font-light text-champagne">03</span>
              <h3 className="mt-4 font-serif text-2xl font-light">Enduring Lifecycle</h3>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Every stitch, Blake seam, and slip glaze is calculated to age gracefully, developing
                a personal patina across years and decades rather than single seasons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="page-width py-20 text-center sm:py-28">
        <Sparkles className="mx-auto size-5 text-champagne" />
        <blockquote className="mx-auto mt-6 max-w-2xl font-serif text-3xl font-light leading-snug tracking-tight sm:text-4xl">
          &ldquo;Luxury is not excess or ornamentation. It is the peace of knowing something was
          made with complete integrity.&rdquo;
        </blockquote>
        <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Elena Vane · Creative Director, LUXE Maison
        </p>
        <div className="mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 border border-foreground bg-foreground px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-background hover:bg-background hover:text-foreground"
          >
            Explore The Current Edit <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </StoreLayout>
  );
}
