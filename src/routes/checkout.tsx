import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ShieldCheck, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreLayout } from "@/components/storefront";
import { money, products, useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | LUXE" }, { name: "description", content: "Review your details before placing a demo order with LUXE." }, { property: "og:title", content: "Checkout | LUXE" }, { property: "og:description", content: "Review your details before placing a demo order with LUXE." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, completeDemoOrder } = useStorefront();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [busy, setBusy] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + (products.find((p) => p.id === item.productId)?.price ?? 0) * item.quantity, 0);
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 12;
  const total = Math.max(0, subtotal + shipping - discount);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "WELCOME10") {
      const amount = Math.round(subtotal * 0.1);
      setDiscount(amount);
      setCouponApplied(true);
      toast.success("Welcome gift applied — 10% off your items.");
    } else {
      setDiscount(0);
      setCouponApplied(false);
      toast.error("That code didn’t work. Try WELCOME10.");
    }
  };

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    if (cart.length === 0) { toast.error("Your bag is empty."); return; }
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const orderId = completeDemoOrder(email);
    await navigate({ to: "/order-confirmation/$orderId", params: { orderId } });
    setBusy(false);
  };

  return <StoreLayout><section className="page-width pb-20 pt-10 sm:pt-14"><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-20">
    <div><Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><ArrowLeft className="size-3.5" /> Back to bag</Link><p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">A few details</p><h1 className="font-serif text-5xl">Checkout</h1><div className="mt-5 flex items-start gap-3 border border-border bg-muted/50 p-4 text-xs leading-5"><ShieldCheck className="mt-0.5 size-4 shrink-0" /><p><strong className="font-medium">Demo checkout.</strong> This experience does not collect payment or place a real order. Your order summary will be saved on this device.</p></div>
      <form id="checkout-form" onSubmit={placeOrder} className="mt-8 space-y-8">
        <fieldset className="space-y-4"><legend className="mb-4 font-serif text-2xl">Contact</legend><label className="block text-xs">Email address<Input required type="email" name="email" maxLength={255} autoComplete="email" className="mt-2 h-11 rounded-none bg-background" placeholder="you@example.com" /></label></fieldset>
        <fieldset className="space-y-4"><legend className="mb-4 font-serif text-2xl">Delivery address</legend><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs">First name<Input required name="firstName" autoComplete="given-name" maxLength={80} className="mt-2 h-11 rounded-none bg-background" /></label><label className="block text-xs">Last name<Input required name="lastName" autoComplete="family-name" maxLength={80} className="mt-2 h-11 rounded-none bg-background" /></label></div><label className="block text-xs">Street address<Input required name="address" autoComplete="street-address" maxLength={180} className="mt-2 h-11 rounded-none bg-background" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs">City<Input required name="city" autoComplete="address-level2" maxLength={100} className="mt-2 h-11 rounded-none bg-background" /></label><label className="block text-xs">Postal code<Input required name="postalCode" autoComplete="postal-code" maxLength={20} className="mt-2 h-11 rounded-none bg-background" /></label></div><label className="block text-xs">Country<select required name="country" autoComplete="country-name" defaultValue="" className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm"><option value="" disabled>Select a country</option><option>United States</option><option>Canada</option><option>United Kingdom</option><option>Australia</option></select></label></fieldset>
        <p className="text-xs leading-5 text-muted-foreground">No payment information is requested in this demo checkout.</p>
      </form>
    </div>
    <aside className="h-fit border-t border-border pt-5 lg:sticky lg:top-8"><h2 className="font-serif text-3xl">Your order</h2><div className="mt-4 max-h-72 space-y-4 overflow-auto">{cart.map((item) => { const product = products.find((p) => p.id === item.productId); if (!product) return null; return <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3"><img src={product.image} alt="" className="size-[68px] shrink-0 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{product.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{item.color} · {item.size} · Qty {item.quantity}</p></div><p className="shrink-0 text-xs">{money(product.price * item.quantity)}</p></div>; })}</div>
      <div className="mt-5 flex gap-2 border-y border-border py-4"><Input aria-label="Coupon code" maxLength={32} value={coupon} onChange={(event) => setCoupon(event.target.value)} disabled={couponApplied} placeholder="Gift code" className="h-10 rounded-none bg-background text-xs" /><Button type="button" variant="outline" className="h-10 rounded-none text-[10px] uppercase tracking-[0.1em]" disabled={couponApplied || !coupon.trim()} onClick={applyCoupon}>{couponApplied ? <><Check className="size-3.5" /> Applied</> : <><Tag className="size-3.5" /> Apply</>}</Button></div>
      <div className="space-y-3 py-5 text-xs"><div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-olive"><span>Welcome gift</span><span>−{money(discount)}</span></div>}<div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Complimentary" : money(shipping)}</span></div><div className="flex justify-between border-t border-border pt-4 text-base font-medium"><span>Total</span><span>{money(total)}</span></div></div>
      <Button form="checkout-form" type="submit" disabled={busy || cart.length === 0} className="h-12 w-full rounded-none text-[10px] uppercase tracking-[0.15em]">{busy ? "Saving your demo order…" : "Place demo order"}</Button><p className="mt-3 text-center text-[10px] text-muted-foreground">No payment will be taken.</p>
    </aside>
  </div></section></StoreLayout>;
}