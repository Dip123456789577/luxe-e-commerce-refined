import { useState, useMemo, useId, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SlidersHorizontal, X, LayoutGrid, Grid2X2, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductGrid, StoreLayout } from "@/components/storefront";
import { categories, products as initialProducts, type Product } from "@/lib/storefront";
import { productsApi } from "@/lib/api";

type ShopSearch = {
  q?: string | undefined;
  category?: string | undefined;
  sort?: string | undefined;
  priceRange?: string | undefined;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    q: typeof search["q"] === "string" ? search["q"].slice(0, 100) : "",
    category: typeof search["category"] === "string" ? search["category"] : "All",
    sort: typeof search["sort"] === "string" ? search["sort"] : "featured",
    priceRange: typeof search["priceRange"] === "string" ? search["priceRange"] : "all",
  }),
  head: () => ({
    meta: [
      { title: "The Collection — All Curated Pieces | LUXE" },
      {
        name: "description",
        content:
          "Browse our curated collection of fine European linen, Tuscan leather bags, knitwear, and hand-thrown ceramics.",
      },
      { property: "og:title", content: "The Collection — All Curated Pieces | LUXE" },
      {
        property: "og:description",
        content:
          "Browse our curated collection of fine European linen, Tuscan leather bags, knitwear, and hand-thrown ceramics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [columnsLayout, setColumnsLayout] = useState<"compact" | "editorial">("compact");
  const searchInputId = useId();
  const [catalog, setCatalog] = useState<Product[]>(initialProducts);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await productsApi.getProducts({ limit: 50 });
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Product[] = (
            res.data as Array<{
              _id: string;
              slug: string;
              name: string;
              category: Product["category"];
              price: number;
              compareAt?: number;
              images?: string[];
              subtitle?: string;
              badge?: string;
              colors?: string[];
              sizes?: string[];
              rating?: number;
              reviewsCount?: number;
              description?: string;
              craftsmanship?: string;
              materials?: string;
              care?: string;
              origin?: string;
            }>
          ).map((p) => {
            const fallback = initialProducts.find((ip) => ip.id === p.slug);
            return {
              id: p.slug || p._id,
              name: p.name,
              category: p.category,
              price: p.price,
              compareAt: p.compareAt,
              image: p.images?.[0] || fallback?.image || "",
              gallery: p.images && p.images.length > 0 ? p.images : fallback?.gallery || [],
              subtitle: p.subtitle || fallback?.subtitle || "",
              badge: p.badge || fallback?.badge,
              colors: p.colors && p.colors.length > 0 ? p.colors : fallback?.colors || ["Natural"],
              sizes: p.sizes && p.sizes.length > 0 ? p.sizes : fallback?.sizes || ["Standard"],
              rating: p.rating ?? fallback?.rating ?? 4.8,
              reviews: p.reviewsCount ?? fallback?.reviews ?? 10,
              description: p.description || fallback?.description || "",
              craftsmanship: p.craftsmanship || fallback?.craftsmanship,
              materials: p.materials || fallback?.materials,
              care: p.care || fallback?.care,
              origin: p.origin || fallback?.origin,
              customerReviews: fallback?.customerReviews,
            };
          });
          setCatalog(mapped);
        }
      } catch (err) {
        console.warn("Unable to fetch live catalog, retaining fallback pieces:", err);
      }
    }
    void loadCatalog();
  }, []);

  const setFilters = (next: Partial<ShopSearch>) =>
    void navigate({ search: (current) => ({ ...current, ...next }) });

  const shown = useMemo(() => {
    const query = filters.q?.trim().toLowerCase() ?? "";
    const result = catalog.filter((item) => {
      // Category filter
      const matchesCategory =
        !filters.category || filters.category === "All" || item.category === filters.category;

      // Query filter
      const matchesQuery =
        !query ||
        `${item.name} ${item.category} ${item.subtitle} ${item.description}`
          .toLowerCase()
          .includes(query);

      // Price range filter
      let matchesPrice = true;
      if (filters.priceRange === "under-100") matchesPrice = item.price < 100;
      else if (filters.priceRange === "100-200")
        matchesPrice = item.price >= 100 && item.price <= 200;
      else if (filters.priceRange === "over-200") matchesPrice = item.price > 200;

      return matchesCategory && matchesQuery && matchesPrice;
    });

    if (filters.sort === "price-low") result.sort((a, b) => a.price - b.price);
    else if (filters.sort === "price-high") result.sort((a, b) => b.price - a.price);
    else if (filters.sort === "top-rated") result.sort((a, b) => b.rating - a.rating);
    else if (filters.sort === "newest") {
      result.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }

    return result;
  }, [filters, catalog]);

  const activeCategory = filters.category ?? "All";
  const activeSort = filters.sort ?? "featured";
  const activePriceRange = filters.priceRange ?? "all";
  const hasActiveFilters =
    Boolean(filters.q) ||
    activeCategory !== "All" ||
    activePriceRange !== "all" ||
    activeSort !== "featured";

  const clearAllFilters = () => {
    void navigate({
      search: {
        q: "",
        category: "All",
        sort: "featured",
        priceRange: "all",
      },
    });
  };

  return (
    <StoreLayout>
      <section className="page-width pb-20 pt-8 sm:pb-28 sm:pt-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground">
            Atelier
          </Link>
          <span>/</span>
          <span className="text-foreground">The Collection</span>
          {activeCategory !== "All" && (
            <>
              <span>/</span>
              <span className="text-foreground">{activeCategory}</span>
            </>
          )}
        </nav>

        {/* Header Title */}
        <div className="border-b border-border/80 pb-8 sm:pb-10">
          <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Considered Wardrobe & Living
          </p>
          <h1 className="font-serif text-5xl font-light tracking-tight text-foreground sm:text-6xl">
            {activeCategory === "All" ? "The Complete Edit" : `${activeCategory} Collection`}
          </h1>
          <p className="mt-3 max-w-xl text-xs leading-6 text-muted-foreground sm:text-sm">
            {activeCategory === "All" &&
              "Every silhouette, carryall, and ceramic vessel created for enduring daily rituals."}
            {activeCategory === "Clothing" &&
              "Tailored French linen, seamless 3D merino knits, and sandwashed mulberry silk."}
            {activeCategory === "Bags" &&
              "Full-grain Tuscan vegetable-tanned leather and water-resistant organic cotton duck."}
            {activeCategory === "Home" &&
              "Hand-thrown regional stoneware, botanical room scents, and cloud-soft cashmere throws."}
            {activeCategory === "Jewelry" &&
              "Hammered 18k solid gold vermeil and recycled sterling silver crafted by master jewelers."}
            {activeCategory === "Shoes" &&
              "French calfskin loafers sculpted over traditional wooden lasts with Blake stitching."}
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="grid gap-4 border-b border-border/70 py-4 sm:flex sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div
            className="flex min-w-0 flex-wrap items-center gap-1.5"
            aria-label="Filter products by department"
          >
            <SlidersHorizontal className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
            {["All", ...categories].map((category) => (
              <button
                key={category}
                type="button"
                className={`border px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                  activeCategory === category
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:border-foreground"
                }`}
                aria-pressed={activeCategory === category}
                onClick={() => setFilters({ category })}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort & Grid Layout */}
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs text-muted-foreground">
              {shown.length} {shown.length === 1 ? "piece" : "pieces"}
            </span>

            {/* Layout Toggle */}
            <div className="hidden items-center border border-border md:flex">
              <button
                type="button"
                aria-label="Compact 4-column grid view"
                onClick={() => setColumnsLayout("compact")}
                className={`p-1.5 ${
                  columnsLayout === "compact"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Editorial 2-column grid view"
                onClick={() => setColumnsLayout("editorial")}
                className={`p-1.5 ${
                  columnsLayout === "editorial"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid2X2 className="size-3.5" />
              </button>
            </div>

            {/* Sort Select */}
            <Select value={activeSort} onValueChange={(sort) => setFilters({ sort })}>
              <SelectTrigger
                aria-label="Sort products"
                className="h-8.5 w-[165px] rounded-none border-border bg-card text-xs focus:ring-0"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border bg-card">
                <SelectItem value="featured">Curated Feature</SelectItem>
                <SelectItem value="newest">Newest Additions</SelectItem>
                <SelectItem value="top-rated">Top Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Secondary Filters Bar (Search & Price Tier) */}
        <div className="flex flex-col justify-between gap-3 border-b border-border/50 py-3.5 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2">
            <label htmlFor={searchInputId} className="sr-only">
              Search the collection
            </label>
            <Input
              id={searchInputId}
              maxLength={100}
              placeholder="Filter by keyword (e.g. linen, merino, ceramic)..."
              value={filters.q ?? ""}
              onChange={(event) => setFilters({ q: event.target.value })}
              className="h-9 max-w-sm rounded-none border-border bg-card text-xs shadow-none"
            />
            {filters.q && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 rounded-none text-xs"
                onClick={() => setFilters({ q: "" })}
              >
                Clear <X className="ml-1 size-3" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Price:
            </span>
            {[
              { label: "All", value: "all" },
              { label: "Under $100", value: "under-100" },
              { label: "$100–$200", value: "100-200" },
              { label: "$200+", value: "over-200" },
            ].map((tier) => (
              <button
                key={tier.value}
                type="button"
                onClick={() => setFilters({ priceRange: tier.value })}
                className={`border px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors ${
                  activePriceRange === tier.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-3 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Active Filters:
            </span>
            {activeCategory !== "All" && (
              <span className="inline-flex items-center gap-1 border border-border bg-secondary px-2 py-0.5 text-[10px]">
                Department: {activeCategory}
                <button
                  type="button"
                  onClick={() => setFilters({ category: "All" })}
                  className="hover:text-destructive"
                  aria-label="Remove category filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
            {activePriceRange !== "all" && (
              <span className="inline-flex items-center gap-1 border border-border bg-secondary px-2 py-0.5 text-[10px]">
                Price: {activePriceRange}
                <button
                  type="button"
                  onClick={() => setFilters({ priceRange: "all" })}
                  className="hover:text-destructive"
                  aria-label="Remove price filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
            {filters.q && (
              <span className="inline-flex items-center gap-1 border border-border bg-secondary px-2 py-0.5 text-[10px]">
                &ldquo;{filters.q}&rdquo;
                <button
                  type="button"
                  onClick={() => setFilters({ q: "" })}
                  className="hover:text-destructive"
                  aria-label="Remove search query"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              <RotateCcw className="size-3" /> Reset All
            </button>
          </div>
        )}

        {/* Product Grid / Empty State */}
        <div className="pt-8">
          {shown.length > 0 ? (
            <ProductGrid
              items={shown}
              columns={
                columnsLayout === "compact"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2"
              }
            />
          ) : (
            <div className="py-24 text-center">
              <h2 className="font-serif text-3xl font-light sm:text-4xl">
                No pieces match this criteria.
              </h2>
              <p className="mt-3 text-xs leading-6 text-muted-foreground sm:text-sm">
                Try adjusting your price range, clearing search terms, or exploring our entire
                catalog.
              </p>
              <Button
                className="mt-6 rounded-none text-xs uppercase tracking-wider"
                variant="outline"
                onClick={clearAllFilters}
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </StoreLayout>
  );
}
