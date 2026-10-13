import { useState, useId, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
  ArrowRight,
  ArrowUpRight,
  Instagram,
  User,
  Minus,
  Plus,
  Trash2,
  Gift,
  ShieldCheck,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  products,
  categories,
  money,
  getColorHex,
  cartKey,
  useStorefront,
  type Product,
} from "@/lib/storefront";

/* -------------------------------------------------------------------------
   Cart Drawer Component
------------------------------------------------------------------------- */
export function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    giftPackaging,
    toggleGiftPackaging,
    formatPrice,
  } = useStorefront();

  const [promoInput, setPromoInput] = useState("");
  const subtotal = cart.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.productId);
    return sum + (prod?.price ?? 0) * item.quantity;
  }, 0);

  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.percent) / 100) : 0;
  const shippingThreshold = 150;
  const awayFromFreeShipping = Math.max(0, shippingThreshold - subtotal);
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

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300"
        aria-label="Shopping Bag Drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-5">
          <div className="flex items-baseline gap-2">
            <h2 className="font-serif text-2xl tracking-tight">Shopping Bag</h2>
            <span className="text-xs text-muted-foreground">({totalItems})</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close cart drawer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="border-b border-border/50 bg-secondary/50 px-6 py-3 text-xs">
          {awayFromFreeShipping === 0 ? (
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              <Sparkles className="size-3.5 text-champagne" />
              Complimentary worldwide shipping unlocked.
            </p>
          ) : (
            <div>
              <p className="text-muted-foreground">
                Add <strong className="text-foreground">{formatPrice(awayFromFreeShipping)}</strong>{" "}
                more for complimentary courier delivery.
              </p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-champagne transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((shippingThreshold - awayFromFreeShipping) / shippingThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="size-12 stroke-[1.25] text-muted-foreground/60" />
              <h3 className="mt-4 font-serif text-2xl text-foreground">Your bag is empty</h3>
              <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
                Explore our curated collections of linen apparel, handcrafted leather, and timeless
                home decor.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-6 rounded-none text-xs uppercase tracking-widest"
                onClick={() => setIsCartDrawerOpen(false)}
              >
                <Link to="/shop">Discover the Edit</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                const key = cartKey(item);

                return (
                  <article key={key} className="flex gap-4 py-4">
                    <Link
                      to="/product/$slug"
                      params={{ slug: product.id }}
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="size-20 shrink-0 overflow-hidden bg-muted"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-full object-cover transition-transform hover:scale-105"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to="/product/$slug"
                          params={{ slug: product.id }}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="truncate text-xs font-medium hover:underline"
                        >
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(key)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label={`Remove ${product.name} from bag`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {item.color} · {item.size}
                      </p>

                      {item.monogram && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 border border-champagne/50 bg-champagne-light/20 px-2 py-0.5 text-[9px] uppercase tracking-widest text-foreground">
                          <Sparkles className="size-2.5 text-champagne" />
                          <span>
                            Monogram: <strong className="font-semibold">{item.monogram}</strong> (
                            {item.foilStyle ?? "Gold Foil"})
                          </span>
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() => updateQuantity(key, item.quantity - 1)}
                            className="p-1 hover:bg-muted"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-7 text-center text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(key, item.quantity + 1)}
                            className="p-1 hover:bg-muted"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <p className="text-xs font-medium">
                          {formatPrice(product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="border-t border-border bg-background p-6">
            {/* Gift packaging toggle */}
            <div className="mb-4 flex items-center justify-between rounded-xs border border-border/60 bg-secondary/30 p-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Gift className="size-4 text-champagne" />
                <span>Complimentary gift box & wax seal</span>
              </div>
              <button
                type="button"
                onClick={toggleGiftPackaging}
                className={`text-[11px] font-medium uppercase tracking-wider underline ${
                  giftPackaging ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {giftPackaging ? "Included ✓" : "+ Add"}
              </button>
            </div>

            {/* Promo code */}
            <div className="mb-4">
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
                    placeholder="Privilege code (try WELCOME10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="h-8 rounded-none bg-background text-xs"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-none text-[10px] uppercase tracking-wider"
                  >
                    Apply
                  </Button>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-foreground">
                  <span>Atelier Privilege ({appliedPromo.percent}%)</span>
                  <span>−{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-foreground">
                  {awayFromFreeShipping === 0 ? "Complimentary" : formatPrice(12)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border/80 pt-2 text-sm font-medium text-foreground">
                <span>Total</span>
                <span>{formatPrice(Math.max(0, subtotal - discountAmount))}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Button
                asChild
                className="h-11 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.16em] hover:bg-primary/90"
                onClick={() => setIsCartDrawerOpen(false)}
              >
                <Link to="/checkout">
                  Proceed to Checkout <ArrowRight className="ml-2 size-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-9 w-full rounded-none text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                onClick={() => setIsCartDrawerOpen(false)}
              >
                <Link to="/cart">View Full Bag</Link>
              </Button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Search Overlay Component
------------------------------------------------------------------------- */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const searchResults = query.trim()
    ? products.filter((p) => {
        const text = `${p.name} ${p.category} ${p.subtitle} ${p.description}`.toLowerCase();
        return text.includes(query.trim().toLowerCase());
      })
    : [];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    void navigate({ to: "/shop", search: { q: query.trim() } as never });
    onClose();
  };

  const trendingTags = [
    "Linen Dress",
    "Shoulder Bag",
    "Merino Knit",
    "Ceramic",
    "Cashmere",
    "Loafer",
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-md">
      <div className="border-b border-border/80 py-4">
        <div className="page-width flex items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-3">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search garments, leather goods, ceramics, jewelry..."
              className="h-12 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 md:text-xl"
            />
          </form>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close search"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="page-width flex-1 overflow-y-auto py-8">
        {query.trim() === "" ? (
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Trending In Atelier
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setQuery(tag);
                  }}
                  className="rounded-none border border-border bg-card px-3.5 py-1.5 text-xs text-foreground transition-colors hover:border-foreground"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="mt-12">
              <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Featured Highlights
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {products.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    to="/product/$slug"
                    params={{ slug: item.id }}
                    onClick={onClose}
                    className="group"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium group-hover:underline">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">{money(item.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between pb-6">
              <p className="text-xs text-muted-foreground">
                {searchResults.length} {searchResults.length === 1 ? "result" : "results"} for
                &ldquo;
                {query}&rdquo;
              </p>
              {searchResults.length > 0 && (
                <Link
                  to="/shop"
                  search={{ q: query } as never}
                  onClick={onClose}
                  className="text-xs uppercase tracking-wider underline"
                >
                  View all in catalog
                </Link>
              )}
            </div>

            {searchResults.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-serif text-3xl">No pieces matched your search.</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Try searching for linen, wool, ceramic, or browse our complete collection.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-6 rounded-none text-xs"
                  onClick={onClose}
                >
                  <Link to="/shop">Browse All Pieces</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    to="/product/$slug"
                    params={{ slug: item.id }}
                    onClick={onClose}
                    className="group"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium group-hover:underline">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">{money(item.price)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Quick View Modal
------------------------------------------------------------------------- */
export function QuickViewModal({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const { addToCart, isInWishlist, toggleWishlist, formatPrice } = useStorefront();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");

  if (!product) return null;

  const activeSize = selectedSize || product.sizes[0] || "One size";
  const activeColor = selectedColor || product.colors[0] || "Natural";
  const activeImage = selectedImage || product.image;
  const isSaved = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, activeSize, activeColor, 1);
    toast.success(`${product.name} added to your bag.`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-none border border-border bg-background p-0 sm:max-w-4xl">
        <DialogTitle className="sr-only">{product.name} Quick View</DialogTitle>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Gallery view */}
          <div className="space-y-2 bg-muted p-4">
            <div className="aspect-[4/5] overflow-hidden bg-background">
              <img src={activeImage} alt={product.name} className="size-full object-cover" />
            </div>
            {product.gallery.length > 1 && (
              <div className="flex gap-2">
                {product.gallery.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`size-14 overflow-hidden border ${
                      activeImage === img ? "border-foreground" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {product.category} · {product.origin ?? "Atelier Crafted"}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-light text-foreground">
                {product.name}
              </h2>
              <p className="mt-2 text-base font-medium">
                {formatPrice(product.price)}
                {product.compareAt && (
                  <span className="ml-2 text-xs text-muted-foreground line-through">
                    {formatPrice(product.compareAt)}
                  </span>
                )}
              </p>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">{product.description}</p>

              {/* Color Selection */}
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Color: <strong className="text-foreground">{activeColor}</strong>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-1.5 border px-2.5 py-1 text-xs transition-colors ${
                        activeColor === c
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card text-foreground hover:border-foreground"
                      }`}
                    >
                      <span
                        className="size-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: getColorHex(c) }}
                      />
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Size: <strong className="text-foreground">{activeSize}</strong>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-10 border px-2.5 py-1 text-center text-xs transition-colors ${
                        activeSize === s
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card text-foreground hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={handleAdd}
                  className="h-11 flex-1 rounded-none bg-primary text-[10px] uppercase tracking-[0.18em]"
                >
                  Add to Bag · {formatPrice(product.price)}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-11 rounded-none"
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast(isSaved ? "Removed from wishlist" : "Saved to wishlist");
                  }}
                  aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`size-4 ${isSaved ? "fill-current" : ""}`} />
                </Button>
              </div>

              <Link
                to="/product/$slug"
                params={{ slug: product.id }}
                onClick={onClose}
                className="block text-center text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground hover:underline"
              >
                View Full Product Specifications →
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------
   Site Header Component
------------------------------------------------------------------------- */
export function SiteHeader() {
  const { cart, wishlist, setIsCartDrawerOpen, currency, setCurrency, setIsConciergeOpen } =
    useStorefront();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: "Collection", to: "/shop" },
    { label: "Clothing", to: "/shop", search: { category: "Clothing" } },
    { label: "Leather Bags", to: "/shop", search: { category: "Bags" } },
    { label: "Atelier Home", to: "/shop", search: { category: "Home" } },
    { label: "Jewelry", to: "/shop", search: { category: "Jewelry" } },
    { label: "Atelier Story", to: "/about" },
  ];

  return (
    <>
      {/* Editorial Announcement Bar */}
      <div className="flex min-h-8 items-center justify-between border-b border-border/40 bg-foreground px-4 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-primary-foreground sm:px-8">
        <span className="hidden md:inline text-primary-foreground/70">
          Atelier Monograph · Autumn Edit
        </span>
        <span className="mx-auto md:mx-0">
          Complimentary courier delivery on orders over $150 · Worldwide
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsConciergeOpen(true)}
            className="hidden items-center gap-1.5 text-champagne transition-colors hover:text-champagne-light sm:inline-flex"
          >
            <Sparkles className="size-3" /> VIP Concierge
          </button>
          <div className="flex items-center gap-1 border-l border-primary-foreground/20 pl-2.5">
            {(["USD", "EUR", "GBP", "JPY"] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-1 py-0.5 text-[9px] transition-colors ${
                  currency === curr
                    ? "font-semibold text-champagne underline underline-offset-2"
                    : "text-primary-foreground/60 hover:text-primary-foreground"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-md transition-colors">
        <div className="page-width grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <Button
              aria-label="Toggle navigation menu"
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.14em] lg:flex"
          >
            {navLinks.slice(0, 5).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search as never}
                className="transition-colors hover:text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Brand Wordmark (Center) */}
          <div className="flex justify-center text-center">
            <Link to="/" className="group flex flex-col items-center">
              <span className="font-serif text-3xl tracking-[0.08em] text-foreground transition-opacity group-hover:opacity-85 sm:text-4xl">
                LUXE
              </span>
              <span className="text-[8px] uppercase tracking-[0.32em] text-muted-foreground">
                Maison d&rsquo;Artisan
              </span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <Button
              aria-label="Open search modal"
              variant="ghost"
              size="icon"
              className="rounded-none hover:bg-muted"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-4" />
            </Button>

            <Link
              to="/account"
              className="hidden rounded-none p-2.5 text-foreground transition-colors hover:bg-muted sm:inline-flex"
              aria-label="Client Account"
            >
              <User className="size-4" />
            </Link>

            <Link
              to="/wishlist"
              className="relative hidden rounded-none p-2.5 text-foreground transition-colors hover:bg-muted sm:inline-flex"
              aria-label={`Wishlist, ${wishlist.length} saved pieces`}
            >
              <Heart className="size-4" />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-champagne text-[9px] font-semibold text-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button (opens drawer) */}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative inline-flex rounded-none p-2.5 text-foreground transition-colors hover:bg-muted"
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <ShoppingBag className="size-4" />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="border-b border-border bg-background px-6 pb-6 shadow-xl lg:hidden"
          >
            <div className="divide-y divide-border/60">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  search={item.search as never}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3.5 text-xs uppercase tracking-widest text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                Wishlist ({wishlist.length})
              </Link>
              <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                Client Account
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                About LUXE
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Concierge
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

/* -------------------------------------------------------------------------
   Product Card Component
------------------------------------------------------------------------- */
export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const { isInWishlist, toggleWishlist, addToCart, formatPrice } = useStorefront();
  const [internalQuickViewOpen, setInternalQuickViewOpen] = useState(false);
  const isSaved = isInWishlist(product.id);

  const handleQuickAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to your bag.`);
  };

  const handleOpenQuickView = () => {
    if (onQuickView) {
      onQuickView(product);
    } else {
      setInternalQuickViewOpen(true);
    }
  };

  return (
    <>
      <article className="group min-w-0">
        <div className="relative overflow-hidden bg-muted">
          <Link
            to="/product/$slug"
            params={{ slug: product.id }}
            aria-label={`View ${product.name}`}
            className="block aspect-[4/5] overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              width={1024}
              height={1280}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </Link>

          {/* Badge */}
          {product.badge && (
            <span className="absolute left-3 top-3 border border-border/40 bg-background/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-foreground backdrop-blur-xs">
              {product.badge}
            </span>
          )}

          {/* Wishlist toggle */}
          <Button
            type="button"
            aria-label={
              isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
            }
            variant="ghost"
            size="icon"
            className="absolute right-2.5 top-2.5 rounded-full bg-background/85 hover:bg-background"
            onClick={() => {
              toggleWishlist(product.id);
              toast(isSaved ? "Removed from your wishlist" : "Saved to your wishlist");
            }}
          >
            <Heart
              className={`size-4 ${isSaved ? "fill-current text-primary" : "text-foreground"}`}
            />
          </Button>

          {/* Quick view button (hover overlay) */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100 focus-within:opacity-100 max-sm:hidden">
            <Button
              type="button"
              variant="outline"
              className="h-9 flex-1 rounded-none border border-foreground/30 bg-background/95 text-[10px] uppercase tracking-wider backdrop-blur-xs hover:bg-foreground hover:text-background"
              onClick={handleQuickAdd}
            >
              Quick Add
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-none border border-foreground/30 bg-background/95 px-3 text-[10px] uppercase tracking-wider backdrop-blur-xs hover:bg-foreground hover:text-background"
              onClick={handleOpenQuickView}
            >
              Inspect
            </Button>
          </div>
        </div>

        {/* Card info */}
        <div className="pt-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                to="/product/$slug"
                params={{ slug: product.id }}
                className="block truncate text-xs font-medium text-foreground hover:underline"
              >
                {product.name}
              </Link>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {product.subtitle}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-foreground">{formatPrice(product.price)}</p>
              {product.compareAt && (
                <p className="text-[10px] text-muted-foreground line-through">
                  {formatPrice(product.compareAt)}
                </p>
              )}
            </div>
          </div>

          {/* Color swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              {product.colors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className="size-2 rounded-full border border-black/15"
                  style={{ backgroundColor: getColorHex(c) }}
                />
              ))}
              <span className="ml-1 text-[10px] text-muted-foreground">
                {product.colors.length} {product.colors.length === 1 ? "shade" : "shades"}
              </span>
            </div>
          )}

          {/* Mobile Quick Add */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 h-8 w-full rounded-none text-[10px] uppercase tracking-wider sm:hidden"
            onClick={handleQuickAdd}
          >
            Add to Bag · {formatPrice(product.price)}
          </Button>
        </div>
      </article>

      {/* Internal modal fallback if parent did not provide onQuickView */}
      {!onQuickView && (
        <QuickViewModal
          product={product}
          open={internalQuickViewOpen}
          onClose={() => setInternalQuickViewOpen(false)}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------
   Product Grid
------------------------------------------------------------------------- */
export function ProductGrid({
  items = products,
  columns = "grid-cols-2 lg:grid-cols-4",
}: {
  items?: Product[];
  columns?: string;
}) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <div className={`grid ${columns} gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12`}>
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}

/* -------------------------------------------------------------------------
   Section Heading
------------------------------------------------------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { label: string; to: "/shop" };
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border/50 pb-5 sm:mb-10 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-3xl font-light tracking-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-xl text-xs leading-6 text-muted-foreground sm:text-sm">
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          to={link.to}
          className="group inline-flex shrink-0 items-center gap-1.5 border-b border-foreground pb-1 text-[10px] uppercase tracking-[0.18em]"
        >
          {link.label}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Category Links
------------------------------------------------------------------------- */
export function CategoryLinks() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden bg-border/80 sm:grid-cols-5">
      {categories.map((category, index) => (
        <Link
          key={category}
          to="/shop"
          search={{ category } as never}
          className="group flex min-h-36 flex-col justify-between bg-background p-5 transition-colors hover:bg-muted/70 sm:min-h-48 sm:p-7"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            0{index + 1}
          </span>
          <span className="flex items-center justify-between font-serif text-xl sm:text-2xl">
            {category}
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </span>
        </Link>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Site Footer
------------------------------------------------------------------------- */
export function SiteFooter() {
  const [email, setEmail] = useState("");
  const newsletterInputId = useId();

  const handleSubscribe = (event: FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Welcome to the LUXE Atelier list. 10% privilege has been credited.");
    setEmail("");
  };

  return (
    <footer className="mt-24 border-t border-border bg-[#F5F3ED]">
      <div className="page-width grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.3fr] lg:gap-10 lg:py-20">
        <div>
          <Link to="/" className="font-serif text-3xl tracking-tight">
            LUXE
          </Link>
          <p className="mt-4 max-w-xs text-xs leading-6 text-muted-foreground">
            Thoughtfully curated garments, vegetable-tanned leather goods, and timeless home
            objects. Crafted to be cherished, chosen to last.
          </p>
          <div className="mt-6 flex items-center gap-4 text-muted-foreground">
            <a
              aria-label="LUXE on Instagram"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              <Instagram className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em]">The Edit</p>
          <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
            <Link to="/shop" className="transition-colors hover:text-foreground">
              All Collections
            </Link>
            <Link
              to="/shop"
              search={{ category: "Clothing" } as never}
              className="transition-colors hover:text-foreground"
            >
              Linen & Knitwear
            </Link>
            <Link
              to="/shop"
              search={{ category: "Bags" } as never}
              className="transition-colors hover:text-foreground"
            >
              Leather Goods
            </Link>
            <Link
              to="/shop"
              search={{ category: "Home" } as never}
              className="transition-colors hover:text-foreground"
            >
              Artisan Ceramics & Home
            </Link>
            <Link
              to="/shop"
              search={{ category: "Jewelry" } as never}
              className="transition-colors hover:text-foreground"
            >
              Fine Jewelry
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em]">Client Care</p>
          <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
            <Link to="/about" className="transition-colors hover:text-foreground">
              The Atelier Story
            </Link>
            <Link to="/contact" className="transition-colors hover:text-foreground">
              Concierge Service
            </Link>
            <Link to="/shipping-returns" className="transition-colors hover:text-foreground">
              Shipping & Returns
            </Link>
            <Link to="/faq" className="transition-colors hover:text-foreground">
              Frequently Asked Questions
            </Link>
            <Link to="/account" className="transition-colors hover:text-foreground">
              Client Portal & Orders
            </Link>
            <Link to="/admin" className="transition-colors hover:text-foreground">
              Director Console (Admin)
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em]">
            The Atelier Monograph
          </p>
          <p className="mb-4 text-xs leading-5 text-muted-foreground">
            Receive private release notes, craftsmanship journals, and 10% privilege on your
            inaugural acquisition.
          </p>
          <form onSubmit={handleSubscribe} className="flex border-b border-foreground/50 pb-1">
            <label htmlFor={newsletterInputId} className="sr-only">
              Email for newsletter
            </label>
            <Input
              id={newsletterInputId}
              type="email"
              maxLength={255}
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 rounded-none border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              aria-label="Subscribe to newsletter"
              variant="ghost"
              size="icon"
              className="rounded-none hover:bg-transparent"
            >
              <ArrowRight className="size-4" />
            </Button>
          </form>
          <p className="mt-3 text-[10px] text-muted-foreground/80">
            By subscribing, you accept our privacy terms. Unsubscribe at any moment.
          </p>
        </div>
      </div>

      <div className="page-width flex flex-col gap-4 border-t border-border/80 py-6 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 LUXE Maison d&rsquo;Artisan. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link to="/shipping-returns" className="hover:text-foreground transition-colors">
            Dispatch & Returns
          </Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Charter
          </Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <span>·</span>
          <Link to="/admin" className="hover:text-foreground transition-colors">
            Director Access
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------
   VIP Atelier Concierge Modal Component
------------------------------------------------------------------------- */
export function ConciergeModal() {
  const { isConciergeOpen, setIsConciergeOpen } = useStorefront();
  const [topic, setTopic] = useState("Private Styling");
  const [contactMethod, setContactMethod] = useState("WhatsApp VIP");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isConciergeOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Private Concierge request logged. An atelier advisor will connect shortly.");
    setTimeout(() => {
      setSubmitted(false);
      setIsConciergeOpen(false);
      setNotes("");
    }, 2000);
  };

  return (
    <Dialog open={isConciergeOpen} onOpenChange={setIsConciergeOpen}>
      <DialogContent className="max-w-lg rounded-none border border-border bg-background p-6 sm:p-8">
        <DialogTitle className="font-serif text-3xl font-light text-foreground">
          Atelier Private Concierge
        </DialogTitle>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Direct consultation with our Paris & Florence atelier directors for bespoke sizing,
          personalized leather monograms, and private showroom appointments.
        </p>

        {submitted ? (
          <div className="py-10 text-center">
            <Sparkles className="mx-auto size-8 text-champagne" />
            <h4 className="mt-4 font-serif text-2xl text-foreground">Monograph Logged</h4>
            <p className="mt-2 text-xs text-muted-foreground">
              An atelier advisor has been dedicated to your request.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Consultation Focus
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {["Private Styling", "Material Swatches", "Custom Sizing"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`border px-2.5 py-2 text-[10px] uppercase tracking-wider transition-colors ${
                      topic === t
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-foreground hover:border-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Preferred Dispatch Channel
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["WhatsApp VIP", "Private Email", "Phone Appointment"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setContactMethod(m)}
                    className={`border px-3 py-1.5 text-xs transition-colors ${
                      contactMethod === m
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-foreground hover:border-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Special Request or Piece of Interest
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Inquire about leather grades, wedding atelier fittings, or private delivery..."
                rows={3}
                className="mt-2 w-full border border-border bg-card p-3 text-xs placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              className="mt-4 h-11 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.2em]"
            >
              Request Atelier Consultation
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------
   Store Layout
------------------------------------------------------------------------- */
export function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-sand-deep selection:text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <ConciergeModal />
    </div>
  );
}
