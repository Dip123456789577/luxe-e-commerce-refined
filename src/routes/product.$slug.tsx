import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, Star, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductGrid, SectionHeading, StoreLayout } from "@/components/storefront";
import { money, products, useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({ meta: [{ title: "A considered find | LUXE" }, { name: "description", content: "Discover a considered piece from LUXE." }, { property: "og:title", content: "A considered find | LUXE" }, { property: "og:description", content: "Discover a considered piece from LUXE." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ProductPage,
  notFoundComponent: () => <StoreLayout><section className="page-width py-24 text-center"><h1 className="font-serif text-5xl">This piece has moved on.</h1><Link to="/shop" className="mt-6 inline-flex border-b border-foreground pb-1 text-xs uppercase tracking-[0.14em]">Explore the collection</Link></section></StoreLayout>,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = products.find((item) => item.id === slug);
  const { addToCart, wishlist, toggleWishlist } = useStorefront();
  const [size, setSize] = useState(product?.sizes[0] ?? "One size");
  const [color, setColor] = useState(product?.colors[0] ?? "Natural");
  const [quantity, setQuantity] = useState(1);
  if (!product) return <StoreLayout><section className="page-width py-24 text-center"><h1 className="font-serif text-5xl">This piece has moved on.</h1><Link to="/shop" className="mt-6 inline-flex border-b border-foreground pb-1 text-xs uppercase tracking-[0.14em]">Explore the collection</Link></section></StoreLayout>;
  const saved = wishlist.includes(product.id);
  return <StoreLayout>
    <section className="page-width pb-16 pt-6 sm:pb-24">
      <div className="mb-6 flex gap-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"><Link to="/shop">The collection</Link><span>/</span><span>{product.category}</span><span>/</span><span className="text-foreground">{product.name}</span></div>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[92px_minmax(0,1fr)]">
          <div className="order-2 flex gap-2 sm:order-1 sm:flex-col"><button type="button" aria-label={`${product.name} image 1`} className="aspect-[4/5] w-16 shrink-0 overflow-hidden border border-foreground sm:w-full"><img src={product.image} alt="" className="size-full object-cover" /></button><button type="button" aria-label={`${product.name} image detail`} className="aspect-[4/5] w-16 shrink-0 overflow-hidden border border-border sm:w-full"><img src={product.image} alt="" className="size-full scale-125 object-cover" /></button></div>
          <div className="order-1 overflow-hidden bg-muted sm:order-2"><img src={product.image} alt={product.name} width={1024} height={1280} className="aspect-[4/5] size-full object-cover" /></div>
        </div>
        <div className="lg:sticky lg:top-8 lg:self-start lg:pt-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{product.category} · Thoughtfully chosen</p>
          <h1 className="mt-3 font-serif text-5xl leading-[0.98] sm:text-6xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2"><span className="flex gap-0.5" aria-label={`${product.rating} out of 5 stars`}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-3 ${i < Math.round(product.rating) ? "fill-current" : ""}`} />)}</span><span className="text-xs text-muted-foreground">{product.rating} · {product.reviews} reviews</span></div>
          <p className="mt-5 text-lg">{money(product.price)}</p>
          <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">{product.description}</p>
          <div className="mt-7"><p className="mb-3 text-[10px] uppercase tracking-[0.15em]">Colour <span className="normal-case tracking-normal text-muted-foreground">· {color}</span></p><div className="flex flex-wrap gap-2">{product.colors.map((item) => <Button key={item} type="button" variant={color === item ? "default" : "outline"} size="sm" aria-pressed={color === item} className="h-9 rounded-none px-4 text-xs" onClick={() => setColor(item)}>{item}</Button>)}</div></div>
          <div className="mt-6"><div className="mb-3 flex items-center justify-between"><p className="text-[10px] uppercase tracking-[0.15em]">Size <span className="normal-case tracking-normal text-muted-foreground">· {size}</span></p>{product.sizes.length > 1 && <button type="button" onClick={() => toast.message("Our fit guide: choose your usual size for an easy, comfortable fit.")} className="text-[10px] underline underline-offset-4">Fit guide</button>}</div><div className="flex flex-wrap gap-2">{product.sizes.map((item) => <Button key={item} type="button" variant={size === item ? "default" : "outline"} size="sm" aria-pressed={size === item} className="h-10 min-w-12 rounded-none px-3 text-xs" onClick={() => setSize(item)}>{item}</Button>)}</div></div>
          <div className="mt-7 flex gap-3"><div className="flex h-12 items-center border border-input"><Button variant="ghost" size="icon" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus className="size-3.5" /></Button><span className="w-8 text-center text-sm" aria-live="polite">{quantity}</span><Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQuantity((current) => Math.min(10, current + 1))}><Plus className="size-3.5" /></Button></div><Button className="h-12 flex-1 rounded-none text-[10px] uppercase tracking-[0.15em]" onClick={() => { for (let i = 0; i < quantity; i += 1) addToCart(product, size, color); toast.success(`${product.name} added to your bag`); }}>Add to bag · {money(product.price * quantity)}</Button><Button variant="outline" size="icon" className="size-12 shrink-0 rounded-none" aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} onClick={() => { toggleWishlist(product.id); toast(saved ? "Removed from your wishlist" : "Saved to your wishlist"); }}><Heart className={`size-4 ${saved ? "fill-current" : ""}`} /></Button></div>
          <div className="mt-8 divide-y divide-border border-y border-border"><div className="flex items-center gap-3 py-4 text-xs"><Truck className="size-4" /><span>Complimentary shipping on orders over $150</span></div><div className="flex items-center gap-3 py-4 text-xs"><RotateCcw className="size-4" /><span>Easy, thoughtful returns within 30 days</span></div><div className="flex items-center gap-3 py-4 text-xs"><ShieldCheck className="size-4" /><span>Secure checkout, always</span></div></div>
          <div className="mt-8 border-t border-border pt-6"><p className="text-[10px] uppercase tracking-[0.15em]">A little more to love</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Designed with care, made for real life. We believe in buying fewer, better things and enjoying them for a long time.</p></div>
        </div>
      </div>
    </section>
    <section className="page-width pb-12"><SectionHeading eyebrow="Keep exploring" title="You may also love" link={{ label: "Shop all", to: "/shop" }} /><ProductGrid items={products.filter((item) => item.id !== product.id).slice(0, 4)} /></section>
  </StoreLayout>;
}