import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductGrid, StoreLayout } from "@/components/storefront";
import { categories, products } from "@/lib/storefront";

type ShopSearch = { q?: string; category?: string; sort?: string };
export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({ q: typeof search.q === "string" ? search.q.slice(0, 100) : "", category: typeof search.category === "string" ? search.category : "All", sort: typeof search.sort === "string" ? search.sort : "featured" }),
  head: () => ({ meta: [{ title: "Shop the collection | LUXE" }, { name: "description", content: "Discover thoughtful fashion and lifestyle pieces from LUXE." }, { property: "og:title", content: "Shop the collection | LUXE" }, { property: "og:description", content: "Discover thoughtful fashion and lifestyle pieces from LUXE." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ShopPage,
});

function ShopPage() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const setFilters = (next: Partial<ShopSearch>) => void navigate({ search: (current) => ({ ...current, ...next }) });
  const shown = useMemo(() => {
    const query = filters.q?.trim().toLocaleLowerCase() ?? "";
    const result = products.filter((item) => (filters.category === "All" || !filters.category || item.category === filters.category) && (!query || `${item.name} ${item.category} ${item.subtitle}`.toLocaleLowerCase().includes(query)));
    if (filters.sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (filters.sort === "top-rated") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [filters]);
  return <StoreLayout>
    <section className="page-width pb-16 pt-10 sm:pb-24 sm:pt-14">
      <div className="border-b border-border pb-7 sm:pb-9"><p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Considered, always</p><h1 className="font-serif text-5xl sm:text-6xl">The collection</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Well-made things for getting dressed, going places and feeling at home.</p></div>
      <div className="grid gap-5 border-b border-border py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="flex min-w-0 flex-wrap items-center gap-2" aria-label="Filter products by category">
          <SlidersHorizontal className="mr-2 size-4 shrink-0 text-muted-foreground" />
          {["All", ...categories].map((category) => <Button key={category} type="button" size="sm" variant={(filters.category ?? "All") === category ? "default" : "outline"} className="h-8 rounded-none text-[10px]" aria-pressed={(filters.category ?? "All") === category} onClick={() => setFilters({ category })}>{category}</Button>)}
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end"><p className="text-xs text-muted-foreground">{shown.length} {shown.length === 1 ? "piece" : "pieces"}</p><Select value={filters.sort ?? "featured"} onValueChange={(sort) => setFilters({ sort })}><SelectTrigger aria-label="Sort products" className="h-9 w-[160px] rounded-none bg-background text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="featured">Featured</SelectItem><SelectItem value="top-rated">Top rated</SelectItem><SelectItem value="price-low">Price: low to high</SelectItem><SelectItem value="price-high">Price: high to low</SelectItem></SelectContent></Select></div>
      </div>
      <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center"><Input aria-label="Search products" maxLength={100} placeholder="Search by name or category" value={filters.q ?? ""} onChange={(event) => setFilters({ q: event.target.value })} className="h-10 max-w-sm rounded-none bg-background text-sm" />{filters.q && <Button type="button" variant="ghost" size="sm" className="w-fit text-xs" onClick={() => setFilters({ q: "" })}>Clear search <X className="size-3.5" /></Button>}</div>
      {shown.length ? <ProductGrid items={shown} /> : <div className="py-20 text-center"><h2 className="font-serif text-3xl">Nothing in this edit just yet.</h2><p className="mt-3 text-sm text-muted-foreground">Try a different search or browse all pieces.</p><Button className="mt-6 rounded-none" variant="outline" onClick={() => void navigate({ search: { q: "", category: "All", sort: "featured" } })}>View the full collection</Button></div>}
    </section>
  </StoreLayout>;
}