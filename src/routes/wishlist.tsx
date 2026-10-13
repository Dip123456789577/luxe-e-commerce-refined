import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductGrid, StoreLayout } from "@/components/storefront";
import { products, useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Saved Curations | LUXE Atelier" },
      { name: "description", content: "Review your saved wardrobe and home pieces at LUXE." },
      { property: "og:title", content: "Saved Curations | LUXE Atelier" },
      {
        property: "og:description",
        content: "Review your saved wardrobe and home pieces at LUXE.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStorefront();
  const saved = products.filter((product) => wishlist.includes(product.id));

  const handleMoveAllToCart = () => {
    saved.forEach((item) => addToCart(item));
    toast.success(`Moved ${saved.length} pieces to your shopping bag.`);
  };

  const handleClearWishlist = () => {
    saved.forEach((item) => toggleWishlist(item.id));
    toast.info("Cleared all saved pieces.");
  };

  return (
    <StoreLayout>
      <section className="page-width min-h-[55vh] pb-20 pt-8 sm:pb-28 sm:pt-12">
        <div className="flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:pb-8">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <Heart className="size-3 text-champagne fill-current" /> Personal Curation
            </p>
            <h1 className="font-serif text-5xl font-light tracking-tight text-foreground sm:text-6xl">
              Saved Favorites{" "}
              <span className="align-middle font-sans text-sm font-normal text-muted-foreground">
                ({saved.length})
              </span>
            </h1>
          </div>

          {saved.length > 0 && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none text-[10px] uppercase tracking-wider"
                onClick={handleMoveAllToCart}
              >
                <ShoppingBag className="mr-1.5 size-3.5" /> Move All to Bag
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-none text-[10px] uppercase tracking-wider text-muted-foreground hover:text-destructive"
                onClick={handleClearWishlist}
              >
                <Trash2 className="mr-1 size-3" /> Clear
              </Button>
            </div>
          )}
        </div>

        {saved.length ? (
          <div className="pt-10">
            <ProductGrid items={saved} />
          </div>
        ) : (
          <div className="py-24 text-center">
            <Heart className="mx-auto size-14 stroke-[1] text-muted-foreground/50" />
            <h2 className="mt-4 font-serif text-4xl font-light text-foreground">
              Your curation is waiting.
            </h2>
            <p className="mt-3 text-xs leading-6 text-muted-foreground sm:text-sm">
              Tap the heart icon on any piece to save it for your considered wardrobe.
            </p>
            <Button
              asChild
              className="mt-8 h-12 rounded-none px-8 text-[10px] uppercase tracking-[0.18em]"
            >
              <Link to="/shop">
                Explore The Collection <ArrowRight className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* Recommended highlights */}
      {saved.length === 0 && (
        <section className="page-width border-t border-border/70 py-16">
          <h2 className="mb-8 font-serif text-3xl font-light">Recommended For You</h2>
          <ProductGrid items={products.slice(0, 4)} />
        </section>
      )}
    </StoreLayout>
  );
}
