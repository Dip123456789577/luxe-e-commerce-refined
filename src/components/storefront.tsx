import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, X, ArrowUpRight, Instagram } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products, categories, money, useStorefront, type Product } from "@/lib/storefront";

export function SiteHeader() {
  const { cart, wishlist } = useStorefront();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    void navigate({ to: "/shop", search: { q: query } as never });
    setSearchOpen(false);
    setMenuOpen(false);
  };
  const links = [{ label: "Shop all", to: "/shop" }, { label: "Clothing", to: "/shop", search: { category: "Clothing" } }, { label: "Bags", to: "/shop", search: { category: "Bags" } }, { label: "Home", to: "/shop", search: { category: "Home" } }, { label: "Our story", to: "/about" }];

  return <>
    <div className="flex min-h-8 items-center justify-center bg-foreground px-4 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-primary-foreground">Complimentary shipping on orders over $150</div>
    <header className="relative z-30 border-b border-border/70 bg-background">
      <div className="page-width grid h-[76px] grid-cols-[1fr_auto_1fr] items-center">
        <Button aria-label="Open navigation" variant="ghost" size="icon" className="justify-self-start md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        <nav className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.12em] md:flex">
          {links.slice(0, 4).map((item) => <Link key={item.label} to={item.to} search={item.search as never} className="transition-colors hover:text-muted-foreground">{item.label}</Link>)}
        </nav>
        <Link to="/" className="font-serif text-[31px] leading-none tracking-[0.03em]">LUXE</Link>
        <div className="flex items-center justify-self-end gap-1">
          <Button aria-label="Search products" variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}><Search /></Button>
          <Link to="/wishlist" className="relative hidden rounded-sm p-2.5 transition-colors hover:bg-muted sm:inline-flex" aria-label={`Wishlist, ${wishlist.length} items`}><Heart className="size-4" />{wishlist.length > 0 && <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">{wishlist.length}</span>}</Link>
          <Link to="/cart" className="relative inline-flex rounded-sm p-2.5 transition-colors hover:bg-muted" aria-label={`Shopping bag, ${count} items`}><ShoppingBag className="size-4" />{count > 0 && <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">{count}</span>}</Link>
        </div>
      </div>
      {searchOpen && <form onSubmit={submitSearch} className="page-width flex items-center gap-3 border-t border-border py-3"><Search className="size-4 shrink-0 text-muted-foreground" /><Input autoFocus aria-label="Search the collection" placeholder="Search the collection..." value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0" /><Button type="submit" variant="outline" size="sm">Search</Button></form>}
      {menuOpen && <nav className="absolute left-0 right-0 top-full flex flex-col border-b border-border bg-background px-6 pb-5 shadow-sm md:hidden">{links.map((item) => <Link key={item.label} to={item.to} search={item.search as never} onClick={() => setMenuOpen(false)} className="border-b border-border/70 py-4 text-sm">{item.label}</Link>)}<div className="flex gap-5 pt-4 text-xs text-muted-foreground"><Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist ({wishlist.length})</Link><Link to="/account" onClick={() => setMenuOpen(false)}>My account</Link></div></nav>}
    </header>
  </>;
}

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email.trim())) { toast.error("Enter a valid email address."); return; } toast.success("You're on the list. Welcome to LUXE."); setEmail(""); };
  return <footer className="mt-24 border-t border-border bg-muted/55">
    <div className="page-width grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1.35fr] lg:gap-10 lg:py-20">
      <div><Link to="/" className="font-serif text-3xl">LUXE</Link><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">Thoughtful things for the way you live. Made to be loved, chosen to last.</p><a aria-label="LUXE on Instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="mt-5 inline-flex"><Instagram className="size-4" /></a></div>
      <div><p className="mb-5 text-[10px] font-medium uppercase tracking-[0.18em]">Explore</p><div className="flex flex-col gap-3 text-sm text-muted-foreground"><Link to="/shop">Shop all</Link><Link to="/shop" search={{ category: "Clothing" } as never}>Clothing</Link><Link to="/wishlist">Wishlist</Link><Link to="/about">Our story</Link></div></div>
      <div><p className="mb-5 text-[10px] font-medium uppercase tracking-[0.18em]">Here to help</p><div className="flex flex-col gap-3 text-sm text-muted-foreground"><Link to="/contact">Contact us</Link><Link to="/faq">FAQs</Link><Link to="/account">Your account</Link><Link to="/account">Order history</Link></div></div>
      <div><p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em]">A little note from us</p><p className="mb-4 text-sm leading-6 text-muted-foreground">New finds, thoughtful stories and 10% off your first order.</p><form onSubmit={submit} className="flex border-b border-foreground/40"><Input type="email" maxLength={255} aria-label="Email for newsletter" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" /><Button type="submit" aria-label="Subscribe to newsletter" variant="ghost" size="icon"><ArrowUpRight /></Button></form></div>
    </div>
    <div className="page-width flex flex-col gap-3 border-t border-border py-5 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>© 2026 LUXE. Thoughtfully made for everyday living.</p><p>Secure checkout · Easy returns · Considered always</p></div>
  </footer>;
}

export function StoreLayout({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main>{children}</main><SiteFooter /></>;
}

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, addToCart } = useStorefront();
  const saved = wishlist.includes(product.id);
  return <article className="group min-w-0">
    <div className="relative overflow-hidden bg-muted">
      <Link to="/product/$slug" params={{ slug: product.id }} aria-label={`View ${product.name}`} className="block aspect-[4/5] overflow-hidden"><img src={product.image} alt={product.name} width={1024} height={1280} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" /></Link>
      {product.badge && <span className="absolute left-3 top-3 bg-background/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.12em]">{product.badge}</span>}
      <Button type="button" aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} variant="ghost" size="icon" className="absolute right-2 top-2 rounded-full bg-background/85 hover:bg-background" onClick={() => { toggleWishlist(product.id); toast(saved ? "Removed from your wishlist" : "Saved to your wishlist"); }}><Heart className={`size-4 ${saved ? "fill-current" : ""}`} /></Button>
      <Button type="button" variant="outline" className="absolute bottom-3 left-3 right-3 h-10 translate-y-2 border-0 bg-background/95 text-xs opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 max-sm:hidden" onClick={() => { addToCart(product); toast.success(`${product.name} added to your bag`); }}>Quick add</Button>
    </div>
    <div className="flex items-start justify-between gap-3 pt-3"><div className="min-w-0"><Link to="/product/$slug" params={{ slug: product.id }} className="block truncate text-[13px] font-medium hover:underline">{product.name}</Link><p className="mt-1 text-[11px] text-muted-foreground">{product.subtitle}</p></div><p className="shrink-0 text-[13px]">{money(product.price)}</p></div>
    <Button type="button" variant="outline" size="sm" className="mt-3 h-9 w-full text-xs sm:hidden" onClick={() => { addToCart(product); toast.success(`${product.name} added to your bag`); }}>Quick add · {money(product.price)}</Button>
  </article>;
}

export function ProductGrid({ items = products, columns = "grid-cols-2 lg:grid-cols-4" }: { items?: Product[]; columns?: string }) {
  return <div className={`grid ${columns} gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10`}>{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}

export function SectionHeading({ eyebrow, title, description, link }: { eyebrow?: string; title: string; description?: string; link?: { label: string; to: "/shop" } }) {
  return <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9"><div>{eyebrow && <p className="mb-2 text-[10px] uppercase tracking-[0.19em] text-muted-foreground">{eyebrow}</p>}<h2 className="font-serif text-4xl leading-none sm:text-5xl">{title}</h2>{description && <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>{link && <Link to={link.to} className="shrink-0 border-b border-foreground pb-1 text-[10px] uppercase tracking-[0.15em]">{link.label} <span aria-hidden="true">↗</span></Link>}</div>;
}

export function CategoryLinks() {
  return <div className="grid grid-cols-2 gap-px overflow-hidden bg-border sm:grid-cols-4">{categories.map((category, index) => <Link key={category} to="/shop" search={{ category } as never} className="group flex min-h-36 flex-col justify-between bg-background p-5 transition-colors hover:bg-muted sm:min-h-48 sm:p-7"><span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">0{index + 1}</span><span className="flex items-center justify-between font-serif text-2xl sm:text-3xl">{category}<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span></Link>)}</div>;
}