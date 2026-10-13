import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryLinks, ProductGrid, SectionHeading, StoreLayout } from "@/components/storefront";
import { products } from "@/lib/storefront";
import heroImage from "@/assets/luxe-editorial-hero.jpg";
import homeImage from "@/assets/luxe-product-home.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "LUXE — Thoughtful things for everyday living" },
    { name: "description", content: "Discover considered fashion and lifestyle pieces, chosen to last and made to be loved." },
    { property: "og:title", content: "LUXE — Thoughtful things for everyday living" },
    { property: "og:description", content: "Discover considered fashion and lifestyle pieces, chosen to last and made to be loved." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});

function HomePage() {
  return <StoreLayout>
    <section className="page-width py-4 sm:py-6">
      <div className="relative min-h-[500px] overflow-hidden bg-muted sm:min-h-[610px] lg:min-h-[680px]">
        <img src={heroImage} alt="A woman in a linen dress in a sunlit coastal home" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 size-full object-cover object-[62%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/45 via-foreground/15 to-transparent" />
        <div className="relative flex min-h-[500px] max-w-[620px] flex-col justify-end px-6 pb-10 text-primary-foreground sm:min-h-[610px] sm:px-12 sm:pb-14 lg:min-h-[680px] lg:px-16">
          <p className="fade-up mb-4 text-[10px] uppercase tracking-[0.2em]">A softer kind of everyday</p>
          <h1 className="fade-up max-w-xl font-serif text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">Make room<br />for the good.</h1>
          <p className="fade-up mt-5 max-w-sm text-sm leading-6 text-primary-foreground/90 sm:text-base">Considered pieces for everyday rituals, slow mornings and everything in between.</p>
          <Link to="/shop" className="mt-7 inline-flex w-fit items-center gap-3 border-b border-primary-foreground/80 pb-2 text-[10px] uppercase tracking-[0.16em] transition-all hover:gap-5">Shop the collection <ArrowRight className="size-3.5" /></Link>
        </div>
        <span className="absolute bottom-5 right-5 text-[9px] uppercase tracking-[0.16em] text-primary-foreground/80 sm:right-8">The considered edit · 01</span>
      </div>
    </section>

    <section className="page-width py-14 sm:py-20">
      <SectionHeading eyebrow="Find your everyday" title="A little of everything" description="Well-made things for getting dressed, going places and feeling at home." />
      <CategoryLinks />
    </section>

    <section className="page-width py-12 sm:py-16">
      <SectionHeading eyebrow="Most loved" title="The pieces you come back to" link={{ label: "Shop all", to: "/shop" }} />
      <ProductGrid items={products.filter((product) => product.badge === "Bestseller" || product.rating >= 4.8).slice(0, 4)} />
    </section>

    <section className="page-width py-12 sm:py-16">
      <div className="grid overflow-hidden bg-sand sm:grid-cols-2">
        <div className="flex flex-col items-start justify-center px-7 py-11 sm:px-12 lg:px-16">
          <p className="mb-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Objects with a point of view</p>
          <h2 className="max-w-md font-serif text-5xl leading-[0.98] sm:text-6xl">A home that feels like you.</h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">The little details make a place. Find the pieces that make yours feel unmistakably home.</p>
          <Button asChild variant="outline" className="mt-7 rounded-none border-foreground/40 bg-transparent px-5 text-[10px] uppercase tracking-[0.14em]"><Link to="/shop" search={{ category: "Home" } as never}>Discover home <ArrowUpRight className="size-3.5" /></Link></Button>
        </div>
        <div className="aspect-[4/3] overflow-hidden sm:aspect-auto"><img src={homeImage} alt="Hand-finished sculptural ceramic vase and candle" width={1024} height={1280} loading="lazy" className="size-full object-cover transition-transform duration-700 hover:scale-[1.025]" /></div>
      </div>
    </section>

    <section className="page-width py-12 sm:py-16">
      <SectionHeading eyebrow="Just arrived" title="New to the edit" link={{ label: "See what’s new", to: "/shop" }} />
      <ProductGrid items={products.filter((product) => product.badge === "New arrival" || product.badge === "Made by hand").concat(products.filter((product) => !product.badge).slice(0, 2))} />
    </section>

    <section className="mt-12 border-y border-border bg-sand/55 py-14 sm:mt-16 sm:py-20">
      <div className="page-width text-center">
        <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">A note from the studio</p>
        <div className="mb-5 flex justify-center gap-1 text-foreground"><Star className="size-3.5 fill-current" /><Star className="size-3.5 fill-current" /><Star className="size-3.5 fill-current" /><Star className="size-3.5 fill-current" /><Star className="size-3.5 fill-current" /></div>
        <blockquote className="mx-auto max-w-3xl font-serif text-3xl leading-tight sm:text-5xl">“Beautifully made, quietly special. The pieces I reach for, every single day.”</blockquote>
        <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Clara M. · Verified customer</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"><span>Considered materials</span><span>·</span><span>Made to last</span><span>·</span><span>Easy, thoughtful returns</span></div>
      </div>
    </section>
    <section className="page-width flex flex-col items-center py-14 text-center sm:py-20"><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">A little more LUXE</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Find your new favourite.</h2><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Good things are waiting in the collection.</p><Link to="/shop" className="mt-6 border-b border-foreground pb-2 text-[10px] uppercase tracking-[0.16em]">Explore the collection <ArrowRight className="ml-2 inline size-3.5" /></Link></section>
  </StoreLayout>;
}