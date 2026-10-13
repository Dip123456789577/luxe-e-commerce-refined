import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid, StoreLayout } from "@/components/storefront";
import { products, useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Your wishlist | LUXE" }, { name: "description", content: "Keep your LUXE favourites close." }, { property: "og:title", content: "Your wishlist | LUXE" }, { property: "og:description", content: "Keep your LUXE favourites close." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStorefront();
  const saved = products.filter((product) => wishlist.includes(product.id));
  return <StoreLayout><section className="page-width min-h-[46vh] pb-16 pt-10 sm:pb-24 sm:pt-14"><div className="border-b border-border pb-7"><p className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground"><Heart className="size-3.5" /> Saved with care</p><h1 className="font-serif text-5xl sm:text-6xl">Your wishlist <span className="align-middle font-sans text-sm text-muted-foreground">({saved.length})</span></h1></div>{saved.length ? <div className="pt-8"><ProductGrid items={saved} /></div> : <div className="py-20 text-center"><h2 className="font-serif text-4xl">Keep the lovely things close.</h2><p className="mt-3 text-sm text-muted-foreground">Tap the heart on a piece you love and it will be waiting here.</p><Button asChild className="mt-7 h-11 rounded-none px-7 text-[10px] uppercase tracking-[0.14em]"><Link to="/shop">Explore the collection <ArrowRight className="size-4" /></Link></Button></div>}</section></StoreLayout>;
}