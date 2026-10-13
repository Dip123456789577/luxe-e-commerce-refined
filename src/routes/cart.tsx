import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Gift,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductGrid, StoreLayout } from "@/components/storefront";
import { cartKey, money, products, useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Shopping Bag | LUXE Atelier" },
      { name: "description", content: "Review your selected pieces in your LUXE shopping bag." },
      { property: "og:title", content: "Your Shopping Bag | LUXE Atelier" },
      {
        property: "og:description",
        content: "Review your selected pieces in your LUXE shopping bag.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    giftPackaging,
    toggleGiftPackaging,
  } = useStorefront();

  const [promoInput, setPromoInput] = useState("");

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (products.find((p) => p.id === item.productId)?.price ?? 0) * item.quantity,
    0,
  );

  const discount = appliedPromo ? Math.round((subtotal * appliedPromo.percent) / 100) : 0;
  const shippingThreshold = 150;
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 12;
  const finalTotal = Math.max(0, subtotal - discount + shipping);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      toast.success(res.message);
      setPromoInput("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <StoreLayout>
      <section className="page-width min-h-[55vh] pb-20 pt-8 sm:pb-28 sm:pt-12">
        {/* Header */}
        <div className="border-b border-border/80 pb-6 sm:pb-8">
          <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Atelier Selection
          </p>
          <h1 className="font-serif text-5xl font-light tracking-tight text-foreground sm:text-6xl">
            Shopping Bag{" "}
            <span className="align-middle font-sans text-sm font-normal text-muted-foreground">
              ({totalItems} {totalItems === 1 ? "piece" : "pieces"})
            </span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center">
            <ShoppingBag className="mx-auto size-16 stroke-[1] text-muted-foreground/60" />
            <h2 className="mt-4 font-serif text-4xl font-light">Your shopping bag is quiet.</h2>
            <p className="mt-3 text-xs leading-6 text-muted-foreground sm:text-sm">
              Discover timeless silhouettes and handcrafted lifestyle objects.
            </p>
            <Button
              asChild
              className="mt-8 h-12 rounded-none px-8 text-[10px] uppercase tracking-[0.18em]"
            >
              <Link to="/shop">
                Explore The Edit <ArrowRight className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
            {/* Items list */}
            <div>
              {/* Shipping Progress */}
              <div className="mb-6 border border-border/60 bg-secondary/40 p-4 text-xs">
                {subtotal >= shippingThreshold ? (
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <Sparkles className="size-4 text-champagne" />
                    Complimentary worldwide express courier unlocked for this order.
                  </p>
                ) : (
                  <div>
                    <p className="text-muted-foreground">
                      Add{" "}
                      <strong className="text-foreground">
                        {money(shippingThreshold - subtotal)}
                      </strong>{" "}
                      more to qualify for complimentary express delivery.
                    </p>
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full bg-champagne transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="divide-y divide-border/60 border-t border-border/60">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  const key = cartKey(item);

                  return (
                    <article
                      key={key}
                      className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[128px_minmax(0,1fr)_auto] sm:gap-6"
                    >
                      <Link
                        to="/product/$slug"
                        params={{ slug: product.id }}
                        className="aspect-[4/5] overflow-hidden bg-muted"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </Link>

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {product.category}
                        </p>
                        <Link
                          to="/product/$slug"
                          params={{ slug: product.id }}
                          className="font-serif text-2xl font-normal text-foreground hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Tone: {item.color} · Size: {item.size}
                        </p>
                        <p className="mt-2 text-xs font-medium text-foreground">
                          {money(product.price)} each
                        </p>

                        <div className="mt-4 flex items-center border border-border sm:w-fit">
                          <button
                            type="button"
                            aria-label={`Decrease ${product.name} quantity`}
                            onClick={() => updateQuantity(key, item.quantity - 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${product.name} quantity`}
                            onClick={() => updateQuantity(key, item.quantity + 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="col-start-2 flex items-start justify-between sm:col-start-3 sm:flex-col sm:items-end">
                        <span className="text-sm font-medium">
                          {money(product.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            removeFromCart(key);
                            toast.success(`${product.name} removed from bag`);
                          }}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label={`Remove ${product.name} from bag`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Summary */}
            <aside className="h-fit border border-border/80 bg-card p-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-2xl font-light">Order Summary</h2>

              {/* Gift Wrap Option */}
              <div className="my-5 border-y border-border/60 py-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="size-4 text-champagne" />
                    <span>Embossed gift packaging</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleGiftPackaging}
                    className={`text-[10px] uppercase tracking-wider underline ${
                      giftPackaging ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {giftPackaging ? "Applied ✓" : "+ Add Complimentary"}
                  </button>
                </div>
              </div>

              {/* Promo code input */}
              <div className="mb-5">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-sand/60 px-3 py-2 text-xs">
                    <span className="font-mono font-medium text-foreground">
                      {appliedPromo.code} ({appliedPromo.percent}% OFF)
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <Input
                      placeholder="Privilege code (e.g. WELCOME10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="h-9 rounded-none text-xs"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      className="h-9 rounded-none text-[10px] uppercase tracking-wider"
                    >
                      Apply
                    </Button>
                  </form>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 border-b border-border/60 pb-5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground">{money(subtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-foreground">
                    <span>Atelier Privilege ({appliedPromo.percent}%)</span>
                    <span>−{money(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "Complimentary" : money(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/80 pt-3 text-base font-medium text-foreground">
                  <span>Total</span>
                  <span>{money(finalTotal)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  asChild
                  className="h-12 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.18em] hover:bg-primary/90"
                >
                  <Link to="/checkout">
                    Continue to Checkout <ArrowRight className="ml-2 size-3.5" />
                  </Link>
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-center text-[10px] text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-champagne" />
                  Encrypted checkout simulation · No actual charge
                </p>

                <Link
                  to="/shop"
                  className="block text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Continue Exploring
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>

      {/* Recommendations */}
      <section className="page-width border-t border-border/70 py-16">
        <h2 className="mb-8 font-serif text-3xl font-light">Consider Alongside</h2>
        <ProductGrid items={products.slice(0, 4)} />
      </section>
    </StoreLayout>
  );
}
