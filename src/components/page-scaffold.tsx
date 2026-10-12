import { Link } from "@tanstack/react-router";
import { StoreLayout } from "@/components/storefront";

export function PageScaffold({ title, note }: { title: string; note: string }) {
  return <StoreLayout><section className="page-width min-h-[50vh] py-16 sm:py-24"><p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">LUXE · Thoughtful things for everyday</p><h1 className="font-serif text-5xl sm:text-6xl">{title}</h1><p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">{note}</p><Link to="/shop" className="mt-8 inline-flex border-b border-foreground pb-2 text-xs uppercase tracking-[0.15em]">Explore the collection <span className="ml-2" aria-hidden="true">↗</span></Link></section></StoreLayout>;
}