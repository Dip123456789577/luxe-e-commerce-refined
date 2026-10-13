import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreLayout } from "@/components/storefront";
import { money, useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  head: () => ({ meta: [{ title: "Order saved | LUXE" }, { name: "description", content: "Your LUXE demo order details." }, { property: "og:title", content: "Order saved | LUXE" }, { property: "og:description", content: "Your LUXE demo order details." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { orderId } = Route.useParams();
  const { orders } = useStorefront();
  const order = orders.find((item) => item.number === orderId);
  return <StoreLayout><section className="page-width min-h-[56vh] py-16 sm:py-24"><div className="mx-auto max-w-2xl border-y border-border py-12 text-center sm:py-16"><div className="mx-auto grid size-14 place-items-center rounded-full bg-muted"><Check className="size-6" /></div><p className="mt-6 text-[10px] uppercase tracking-[0.19em] text-muted-foreground">A note from LUXE</p><h1 className="mt-3 font-serif text-5xl sm:text-6xl">Your order is saved.</h1><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">This is a demo order saved on this device only. No payment was taken and nothing will be shipped.</p>{order ? <div className="mx-auto mt-8 flex max-w-sm items-center justify-between border-y border-border py-4 text-left text-sm"><span className="flex items-center gap-2"><PackageCheck className="size-4" /> {order.number}</span><span>{money(order.total)}</span></div> : <p className="mt-7 text-sm text-muted-foreground">This demo order isn’t available in the saved order list on this device.</p>}<Button asChild className="mt-8 h-11 rounded-none px-7 text-[10px] uppercase tracking-[0.14em]"><Link to="/shop">Back to the collection</Link></Button></div></section></StoreLayout>;
}