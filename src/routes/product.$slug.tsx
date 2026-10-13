import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Ruler,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductGrid, SectionHeading, StoreLayout } from "@/components/storefront";
import { money, getColorHex, products, useStorefront, type Product } from "@/lib/storefront";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const item = products.find((p) => p.id === params.slug);
    const title = item ? `${item.name} | LUXE Atelier` : "Curated Piece | LUXE";
    const desc = item ? item.description : "A considered piece from LUXE Atelier.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <StoreLayout>
      <section className="page-width py-28 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          404 · Archive
        </p>
        <h1 className="mt-3 font-serif text-5xl font-light">
          This piece has retired from the edit.
        </h1>
        <p className="mt-4 text-xs text-muted-foreground">
          Explore our current collection of sustainable linen, fine wool, and ceramics.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex border border-foreground bg-foreground px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-background hover:bg-background hover:text-foreground"
        >
          Explore the collection
        </Link>
      </section>
    </StoreLayout>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = products.find((item) => item.id === slug);
  const { addToCart, wishlist, toggleWishlist, recordRecentlyViewed, recentlyViewed, formatPrice } =
    useStorefront();

  const [activeImage, setActiveImage] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>("craft");
  const [enableMonogram, setEnableMonogram] = useState(false);
  const [monogramInitials, setMonogramInitials] = useState("");
  const [monogramFoil, setMonogramFoil] = useState("24k Gold Foil");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Keep recently viewed updated
  useEffect(() => {
    if (product) {
      recordRecentlyViewed(product.id);
      setActiveImage(product.image);
      setSize(product.sizes[0] ?? "One size");
      setColor(product.colors[0] ?? "Natural");
      setQuantity(1);
      setEnableMonogram(false);
      setMonogramInitials("");
    }
  }, [product, recordRecentlyViewed]);

  if (!product) {
    return (
      <StoreLayout>
        <section className="page-width py-28 text-center">
          <h1 className="font-serif text-5xl font-light">Piece not found.</h1>
          <Link
            to="/shop"
            className="mt-8 inline-flex border border-foreground bg-foreground px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-background"
          >
            Return to Collection
          </Link>
        </section>
      </StoreLayout>
    );
  }

  const saved = wishlist.includes(product.id);
  const currentImage = activeImage || product.image;
  const galleryList =
    product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const isMonogramEligible = ["Bags", "Shoes", "Clothing"].includes(product.category);

  const handleAdd = () => {
    const finalMonogram =
      enableMonogram && monogramInitials.trim() ? monogramInitials.trim().toUpperCase() : undefined;
    addToCart(
      product,
      size,
      color,
      quantity,
      finalMonogram,
      finalMonogram ? monogramFoil : undefined,
    );
    toast.success(
      `${product.name} (${color}, ${size}${finalMonogram ? ` · Monogram: ${finalMonogram}` : ""}) added to your bag.`,
    );
  };

  const relatedItems = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);
  const fallbackRelated =
    relatedItems.length >= 2
      ? relatedItems
      : products.filter((p) => p.id !== product.id).slice(0, 4);

  const recentlyViewedProducts = recentlyViewed
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  return (
    <StoreLayout>
      {/* Product Detail Main */}
      <section className="page-width pb-20 pt-6 sm:pb-28">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumbs"
          className="mb-8 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground">
            Atelier
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">
            The Collection
          </Link>
          <span>/</span>
          <Link
            to="/shop"
            search={{ category: product.category } as never}
            className="hover:text-foreground"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Gallery Rail & Large View */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[96px_minmax(0,1fr)]">
            {/* Thumbnail selector */}
            <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
              {galleryList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`${product.name} perspective ${idx + 1}`}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`aspect-[4/5] w-18 shrink-0 overflow-hidden border transition-all sm:w-full ${
                    currentImage === imgUrl
                      ? "border-foreground ring-1 ring-foreground"
                      : "border-border/70 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>

            {/* Featured Image */}
            <div className="order-1 overflow-hidden bg-muted sm:order-2">
              <div
                className="group relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  width={1024}
                  height={1280}
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute bottom-3 right-3 hidden items-center gap-1.5 border border-background/60 bg-background/90 px-2.5 py-1 text-[9px] uppercase tracking-wider backdrop-blur-xs group-hover:inline-flex">
                  <Sparkles className="size-2.5 text-champagne" /> Inspect Texture
                </span>
                {product.badge && (
                  <span className="absolute left-4 top-4 border border-border/40 bg-background/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] backdrop-blur-xs">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product Purchasing Specifications */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-b border-border/60 pb-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {product.category} · {product.origin ?? "Atelier Handcrafted"}
              </p>
              <h1 className="mt-2 font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
                {product.name}
              </h1>

              {/* Reviews Summary */}
              <div className="mt-3 flex items-center gap-3">
                <div
                  className="flex gap-0.5 text-champagne"
                  aria-label={`${product.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${
                        i < Math.round(product.rating) ? "fill-current" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.rating} · ({product.reviews} verified reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-medium text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.compareAt && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.compareAt)}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Taxes calculated at checkout
                </span>
              </div>

              <p className="mt-4 text-xs leading-6 text-muted-foreground sm:text-sm">
                {product.description}
              </p>
            </div>

            {/* Selectors */}
            <div className="py-6 space-y-6 border-b border-border/60">
              {/* Color selector */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-foreground">
                    Colour Palette
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{color}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`flex items-center gap-2 border px-3 py-1.5 text-xs transition-colors ${
                        color === c
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card text-foreground hover:border-foreground"
                      }`}
                    >
                      <span
                        className="size-3 rounded-full border border-black/10"
                        style={{ backgroundColor: getColorHex(c) }}
                      />
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-foreground">
                    Size Selection
                  </span>
                  {product.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider underline underline-offset-4 hover:text-foreground"
                    >
                      <Ruler className="size-3" /> Fit Guide
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`min-w-12 border px-3.5 py-2 text-center text-xs transition-colors ${
                        size === s
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card text-foreground hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bespoke Atelier Monogramming Studio */}
              {isMonogramEligible && (
                <div className="border border-border/80 bg-sand/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-champagne" />
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground">
                        Atelier Monogramming Studio
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnableMonogram(!enableMonogram)}
                      className="text-[10px] uppercase tracking-wider text-muted-foreground underline hover:text-foreground"
                    >
                      {enableMonogram ? "Cancel" : "+ Complimentary"}
                    </button>
                  </div>

                  {enableMonogram && (
                    <div className="mt-3 space-y-3 border-t border-border/60 pt-3">
                      <p className="text-[11px] text-muted-foreground">
                        Bespoke hot-stamping applied by our master artisans. Complimentary on this
                        acquisition.
                      </p>
                      <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                        <input
                          type="text"
                          maxLength={3}
                          value={monogramInitials}
                          onChange={(e) => setMonogramInitials(e.target.value.toUpperCase())}
                          placeholder="INITIALS (e.g. C.M.)"
                          className="h-9 border border-border bg-card px-3 text-xs tracking-widest uppercase focus:border-foreground focus:outline-none"
                        />
                        <div className="flex gap-1">
                          {["24k Gold Foil", "Sterling Silver", "Blind Deboss"].map((foil) => (
                            <button
                              key={foil}
                              type="button"
                              onClick={() => setMonogramFoil(foil)}
                              className={`border px-2 py-1.5 text-[9px] uppercase tracking-wider transition-colors ${
                                monogramFoil === foil
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border bg-card text-muted-foreground hover:border-foreground"
                              }`}
                            >
                              {foil}
                            </button>
                          ))}
                        </div>
                      </div>
                      {monogramInitials && (
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span>Atelier Medallion:</span>
                          <span
                            className={`border px-2 py-0.5 text-xs font-serif font-medium tracking-[0.25em] ${
                              monogramFoil === "24k Gold Foil"
                                ? "border-amber-300 bg-amber-50 text-amber-900"
                                : monogramFoil === "Sterling Silver"
                                  ? "border-slate-300 bg-slate-50 text-slate-800"
                                  : "border-stone-400 bg-stone-100 text-stone-900 shadow-inner"
                            }`}
                          >
                            {monogramInitials}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Stock status indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-700" />
                <span>In Stock · Prepared by order in atelier</span>
              </div>
            </div>

            {/* Action Bar (Quantity + Add to Bag + Wishlist) */}
            <div className="py-6 space-y-4">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex h-12 items-center border border-border bg-card">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-medium">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="px-3 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                {/* Add to Bag */}
                <Button
                  onClick={handleAdd}
                  className="h-12 flex-1 rounded-none bg-primary text-[10px] uppercase tracking-[0.18em] hover:bg-primary/90"
                >
                  Add to Bag · {formatPrice(product.price * quantity)}
                </Button>

                {/* Wishlist toggle */}
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 rounded-none border-border"
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast(saved ? "Removed from your wishlist" : "Saved to your wishlist");
                  }}
                  aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                >
                  <Heart className={`size-4 ${saved ? "fill-current text-primary" : ""}`} />
                </Button>
              </div>

              {/* Value propositions */}
              <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="size-3.5 text-champagne" />
                  <span>Complimentary Shipping &gt; $150</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="size-3.5 text-champagne" />
                  <span>30-Day Thoughtful Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="size-3.5 text-champagne" />
                  <span>Atelier Authenticity</span>
                </div>
              </div>
            </div>

            {/* Accordion Specification Tabs */}
            <div className="divide-y divide-border/60 border-t border-border/60 text-xs">
              {/* Tab 1: Craftsmanship */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === "craft" ? "" : "craft")}
                  className="flex w-full items-center justify-between py-4 text-left font-medium uppercase tracking-wider"
                >
                  <span>Atelier Craftsmanship</span>
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      openAccordion === "craft" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "craft" && (
                  <div className="pb-4 text-muted-foreground leading-6">
                    <p>
                      {product.craftsmanship ??
                        "Hand-finished in our partner atelier using traditional sartorial techniques."}
                    </p>
                    <p className="mt-2 text-[11px]">
                      Origin:{" "}
                      <strong className="text-foreground">
                        {product.origin ?? "Western Europe"}
                      </strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Tab 2: Composition */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === "materials" ? "" : "materials")}
                  className="flex w-full items-center justify-between py-4 text-left font-medium uppercase tracking-wider"
                >
                  <span>Materials & Certification</span>
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      openAccordion === "materials" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "materials" && (
                  <div className="pb-4 text-muted-foreground leading-6">
                    <p>{product.materials ?? "100% sustainably certified natural fibers."}</p>
                  </div>
                )}
              </div>

              {/* Tab 3: Care */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === "care" ? "" : "care")}
                  className="flex w-full items-center justify-between py-4 text-left font-medium uppercase tracking-wider"
                >
                  <span>Care & Maintenance</span>
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      openAccordion === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "care" && (
                  <div className="pb-4 text-muted-foreground leading-6">
                    <p>
                      {product.care ??
                        "Dry clean or gentle hand wash in cold water with eco detergent."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="border-t border-border/70 bg-sand/30 py-16 sm:py-24">
        <div className="page-width">
          <div className="mb-10 flex flex-col justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Client Reflections
              </p>
              <h2 className="mt-1 font-serif text-3xl font-light sm:text-4xl">
                Verified Reviews ({product.reviews})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl font-light">{product.rating}</span>
              <div className="flex gap-0.5 text-champagne">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">Overall Rating</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {(
              product.customerReviews ?? [
                {
                  author: "Margaux D.",
                  rating: 5,
                  date: "October 2026",
                  title: "Exceeded my highest expectations",
                  comment:
                    "The quality of construction and tactile finish are remarkable. It feels like an heirloom piece from day one.",
                  verified: true,
                },
                {
                  author: "Simon K.",
                  rating: 5,
                  date: "September 2026",
                  title: "Incredible attention to detail",
                  comment:
                    "From the wax-sealed delivery box to the precise stitching, LUXE sets a new benchmark for minimalist luxury.",
                  verified: true,
                },
              ]
            ).map((rev, i) => (
              <div key={i} className="border border-border/60 bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-champagne">
                    {Array.from({ length: rev.rating }).map((_, starI) => (
                      <Star key={starI} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                </div>
                <h3 className="mt-3 font-serif text-lg font-normal text-foreground">{rev.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{rev.comment}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="font-medium text-foreground">{rev.author}</span>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-0.5 text-emerald-800">
                      <Check className="size-3" /> Verified Acquisition
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      <section className="page-width py-16 sm:py-24">
        <SectionHeading
          eyebrow="Curated Harmony"
          title="Complete The Look"
          link={{ label: "View All", to: "/shop" }}
        />
        <ProductGrid items={fallbackRelated} />
      </section>

      {/* Recently Viewed Products */}
      {recentlyViewedProducts.length > 0 && (
        <section className="page-width border-t border-border/70 pb-20 pt-12">
          <p className="mb-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Recently Observed
          </p>
          <ProductGrid items={recentlyViewedProducts} columns="grid-cols-2 md:grid-cols-4" />
        </section>
      )}

      {/* Fit Guide Modal */}
      <Dialog open={isSizeGuideOpen} onOpenChange={setIsSizeGuideOpen}>
        <DialogContent className="max-w-xl rounded-none border border-border bg-background p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-light">
              Atelier Sizing & Proportions Guide
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            All LUXE garments are cut with an intentional relaxed silhouette. Order your normal size
            for the intended editorial drape, or size down for a tailored profile.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">Chest (cm)</th>
                  <th className="p-2.5">Waist (cm)</th>
                  <th className="p-2.5">Hips (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-2.5 font-medium">XS</td>
                  <td className="p-2.5 text-muted-foreground">80–84</td>
                  <td className="p-2.5 text-muted-foreground">62–66</td>
                  <td className="p-2.5 text-muted-foreground">88–92</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">S</td>
                  <td className="p-2.5 text-muted-foreground">85–89</td>
                  <td className="p-2.5 text-muted-foreground">67–71</td>
                  <td className="p-2.5 text-muted-foreground">93–97</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">M</td>
                  <td className="p-2.5 text-muted-foreground">90–94</td>
                  <td className="p-2.5 text-muted-foreground">72–76</td>
                  <td className="p-2.5 text-muted-foreground">98–102</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">L</td>
                  <td className="p-2.5 text-muted-foreground">95–101</td>
                  <td className="p-2.5 text-muted-foreground">77–83</td>
                  <td className="p-2.5 text-muted-foreground">103–109</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">XL</td>
                  <td className="p-2.5 text-muted-foreground">102–108</td>
                  <td className="p-2.5 text-muted-foreground">84–90</td>
                  <td className="p-2.5 text-muted-foreground">110–116</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none text-xs uppercase tracking-wider"
              onClick={() => setIsSizeGuideOpen(false)}
            >
              Close Guide
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Atelier 8K Texture Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl overflow-hidden rounded-none border border-border bg-background p-0 sm:max-w-5xl">
          <DialogTitle className="sr-only">{product.name} Texture Lightbox</DialogTitle>
          <div className="relative aspect-[4/5] max-h-[85vh] w-full bg-black/5 flex items-center justify-center overflow-hidden">
            <img src={currentImage} alt={product.name} className="size-full object-contain" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between border border-background/60 bg-background/90 px-4 py-2.5 backdrop-blur-md">
              <div>
                <p className="font-serif text-lg font-light text-foreground">{product.name}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {product.materials ?? "Pure Natural Materials"} · Atelier Macro Resolution
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-none text-[10px] uppercase tracking-wider"
                onClick={() => setIsLightboxOpen(false)}
              >
                Close View
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </StoreLayout>
  );
}
