import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Tag,
  CreditCard,
  Truck,
  Sparkles,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreLayout } from "@/components/storefront";
import { money, products, useStorefront } from "@/lib/storefront";
import { ordersApi } from "@/lib/api";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | LUXE Atelier" },
      { name: "description", content: "Review delivery and payment details for your LUXE order." },
      { property: "og:title", content: "Checkout | LUXE Atelier" },
      {
        property: "og:description",
        content: "Review delivery and payment details for your LUXE order.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const {
    cart,
    clearCart,
    completeDemoOrder,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    giftPackaging,
  } = useStorefront();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "applepay">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (products.find((p) => p.id === item.productId)?.price ?? 0) * item.quantity,
    0,
  );

  const discount = appliedPromo ? Math.round((subtotal * appliedPromo.percent) / 100) : 0;
  const standardShippingCost = subtotal >= 150 || subtotal === 0 ? 0 : 12;
  const shippingFee = shippingMethod === "express" ? 25 : standardShippingCost;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      toast.success(res.message);
      setPromoInput("");
    } else {
      toast.error(res.message);
    }
  };

  const handlePlaceOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;

    if (cart.length === 0) {
      toast.error("Your shopping bag is empty.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const city = String(formData.get("city") ?? "New York").trim();
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const fullName = `${firstName} ${lastName}`.trim() || "Atelier Client";
    const address = String(formData.get("address") ?? "740 Park Avenue").trim();
    const apartment = String(formData.get("apartment") ?? "").trim();
    const state = String(formData.get("state") ?? "NY").trim();
    const postalCode = String(formData.get("postalCode") ?? "10021").trim();
    const country = String(formData.get("country") ?? "United States").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    try {
      const itemsPayload = cart.map((item) => {
        const prod = products.find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          name: prod?.name || item.productId,
          price: prod?.price || 0,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        };
      });

      const res = await ordersApi.createOrder({
        items: itemsPayload,
        shippingAddress: {
          fullName,
          street: address,
          apartment,
          city,
          state,
          postalCode,
          country,
          phone,
        },
        customerEmail: email,
        customerName: fullName,
        customerPhone: phone,
        shippingMethod:
          shippingMethod === "express"
            ? "Priority Express Courier"
            : "Complimentary Atelier Delivery",
        couponCode: appliedPromo?.code,
        giftPackaging,
        paymentProvider: "DEMO",
      });

      if (res.success && res.data) {
        const createdOrder = res.data as { orderNumber: string };
        clearCart();
        toast.success(`Acquisition ${createdOrder.orderNumber} confirmed.`);
        await navigate({
          to: "/order-confirmation/$orderId",
          params: { orderId: createdOrder.orderNumber },
        });
        return;
      }
    } catch (err: unknown) {
      console.warn("API order creation encountered issue, falling back to local monograph:", err);
    }

    // Fallback if network or offline
    const orderId = completeDemoOrder({
      email,
      shippingCity: city,
      shippingMethod:
        shippingMethod === "express"
          ? "Priority Express Courier"
          : "Complimentary Atelier Delivery",
    });

    toast.success("Order confirmed. Saving your order monograph...");
    await navigate({ to: "/order-confirmation/$orderId", params: { orderId } });
    setIsSubmitting(false);
  };

  return (
    <StoreLayout>
      <section className="page-width pb-24 pt-8 sm:pt-12">
        <Link
          to="/cart"
          className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Return to bag
        </Link>

        {/* Demo Disclaimer Banner */}
        <div className="mb-8 border border-border/80 bg-secondary/50 p-4 text-xs leading-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-champagne" />
            <div>
              <p className="font-medium text-foreground">
                Demonstration Luxury Checkout Experience
              </p>
              <p className="text-muted-foreground">
                This is a simulated portfolio store. No actual credit card transactions or live
                charges will be made. Your confirmed order will be saved to your client history on
                this device.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
          {/* Main Checkout Form */}
          <div>
            <h1 className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
              Checkout & Delivery
            </h1>

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="mt-8 space-y-10">
              {/* 1. Contact Information */}
              <fieldset className="space-y-4">
                <legend className="font-serif text-2xl font-light text-foreground">
                  1. Client Contact
                </legend>
                <div>
                  <label
                    htmlFor="checkout-email"
                    className="block text-xs font-medium text-foreground"
                  >
                    Email address for delivery tracking
                  </label>
                  <Input
                    id="checkout-email"
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    defaultValue="clara.moreau@atelier-luxe.com"
                    className="mt-2 h-11 rounded-none bg-card text-xs"
                    placeholder="clara@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-medium text-foreground"
                  >
                    Mobile number (for courier dispatch SMS)
                  </label>
                  <Input
                    id="checkout-phone"
                    required
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    defaultValue="+1 (212) 555-0198"
                    className="mt-2 h-11 rounded-none bg-card text-xs"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </fieldset>

              {/* 2. Shipping Destination */}
              <fieldset className="space-y-4 border-t border-border/60 pt-8">
                <legend className="font-serif text-2xl font-light text-foreground">
                  2. Shipping Destination
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="checkout-first-name"
                      className="block text-xs font-medium text-foreground"
                    >
                      First Name
                    </label>
                    <Input
                      id="checkout-first-name"
                      required
                      name="firstName"
                      autoComplete="given-name"
                      defaultValue="Clara"
                      className="mt-2 h-11 rounded-none bg-card text-xs"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-last-name"
                      className="block text-xs font-medium text-foreground"
                    >
                      Last Name
                    </label>
                    <Input
                      id="checkout-last-name"
                      required
                      name="lastName"
                      autoComplete="family-name"
                      defaultValue="Moreau"
                      className="mt-2 h-11 rounded-none bg-card text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-medium text-foreground"
                  >
                    Street Address & Number
                  </label>
                  <Input
                    id="checkout-address"
                    required
                    name="address"
                    autoComplete="street-address"
                    defaultValue="740 Park Avenue"
                    className="mt-2 h-11 rounded-none bg-card text-xs"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="block text-xs font-medium text-foreground"
                    >
                      City
                    </label>
                    <Input
                      id="checkout-city"
                      required
                      name="city"
                      autoComplete="address-level2"
                      defaultValue="New York"
                      className="mt-2 h-11 rounded-none bg-card text-xs"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-state"
                      className="block text-xs font-medium text-foreground"
                    >
                      State / Region
                    </label>
                    <Input
                      id="checkout-state"
                      required
                      name="state"
                      autoComplete="address-level1"
                      defaultValue="NY"
                      className="mt-2 h-11 rounded-none bg-card text-xs"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-postal-code"
                      className="block text-xs font-medium text-foreground"
                    >
                      Postal Code
                    </label>
                    <Input
                      id="checkout-postal-code"
                      required
                      name="postalCode"
                      autoComplete="postal-code"
                      defaultValue="10021"
                      className="mt-2 h-11 rounded-none bg-card text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-country"
                    className="block text-xs font-medium text-foreground"
                  >
                    Country
                  </label>
                  <select
                    id="checkout-country"
                    required
                    name="country"
                    autoComplete="country-name"
                    defaultValue="United States"
                    className="mt-2 h-11 w-full border border-border bg-card px-3 text-xs"
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>France</option>
                    <option>Italy</option>
                    <option>Canada</option>
                    <option>Japan</option>
                    <option>Australia</option>
                  </select>
                </div>
              </fieldset>

              {/* 3. Delivery Method */}
              <fieldset className="space-y-4 border-t border-border/60 pt-8">
                <legend className="font-serif text-2xl font-light text-foreground">
                  3. Delivery Preference
                </legend>
                <div className="space-y-3">
                  <label
                    className={`flex cursor-pointer items-start justify-between border p-4 transition-colors ${
                      shippingMethod === "standard"
                        ? "border-foreground bg-card"
                        : "border-border bg-background"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingOption"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Standard Atelier Delivery (3–5 Business Days)
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Carbon-neutral eco packaging with signature tracking.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium">
                      {standardShippingCost === 0 ? "Complimentary" : money(12)}
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start justify-between border p-4 transition-colors ${
                      shippingMethod === "express"
                        ? "border-foreground bg-card"
                        : "border-border bg-background"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingOption"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Priority Courier Express (1–2 Business Days)
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Expedited priority courier with appointment delivery window.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium">{money(25)}</span>
                  </label>
                </div>
              </fieldset>

              {/* 4. Payment Simulation */}
              <fieldset className="space-y-4 border-t border-border/60 pt-8">
                <div className="flex items-center justify-between">
                  <legend className="font-serif text-2xl font-light text-foreground">
                    4. Payment Simulation
                  </legend>
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Lock className="size-3 text-champagne" /> 256-Bit SSL Demo
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 border p-3 text-center text-xs transition-colors ${
                      paymentMethod === "card"
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    <CreditCard className="mx-auto mb-1 size-4" /> Credit Card (Demo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("applepay")}
                    className={`flex-1 border p-3 text-center text-xs transition-colors ${
                      paymentMethod === "applepay"
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    <Sparkles className="mx-auto mb-1 size-4" /> Apple Pay / Fast Pay
                  </button>
                </div>

                {paymentMethod === "card" ? (
                  <div className="space-y-3 rounded-none border border-border/80 bg-card p-4">
                    <div>
                      <label
                        htmlFor="checkout-card-number"
                        className="block text-[11px] uppercase tracking-wider text-muted-foreground"
                      >
                        Card Number (Demo)
                      </label>
                      <Input
                        id="checkout-card-number"
                        defaultValue="•••• •••• •••• 4242"
                        className="mt-1 h-10 rounded-none text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="checkout-card-expiry"
                          className="block text-[11px] uppercase tracking-wider text-muted-foreground"
                        >
                          Expiry Date
                        </label>
                        <Input
                          id="checkout-card-expiry"
                          defaultValue="12/28"
                          className="mt-1 h-10 rounded-none text-xs"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="checkout-card-cvc"
                          className="block text-[11px] uppercase tracking-wider text-muted-foreground"
                        >
                          CVC / CVV
                        </label>
                        <Input
                          id="checkout-card-cvc"
                          defaultValue="888"
                          className="mt-1 h-10 rounded-none text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
                    Apple Pay / Digital Wallet authenticated for test demo account.
                  </div>
                )}
              </fieldset>
            </form>
          </div>

          {/* Sidebar Order Review */}
          <aside className="h-fit border border-border/80 bg-card p-6 lg:sticky lg:top-24">
            <h2 className="font-serif text-2xl font-light">Order Monograph</h2>

            {/* Item Thumbnails */}
            <div className="my-5 max-h-72 divide-y divide-border/60 overflow-y-auto">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;

                return (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-3 py-3 first:pt-0"
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="size-16 shrink-0 object-cover bg-muted"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground">{product.name}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {item.color} · {item.size} · Qty {item.quantity}
                      </p>
                      <p className="mt-1 text-xs font-medium">
                        {money(product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gift Wrap Notice */}
            {giftPackaging && (
              <div className="mb-4 flex items-center gap-2 border border-border/60 bg-sand/30 p-2.5 text-[11px]">
                <Sparkles className="size-3.5 text-champagne" />
                <span>Complimentary gift box & wax seal selected</span>
              </div>
            )}

            {/* Promo Code Box */}
            <div className="mb-5 border-y border-border/60 py-3.5">
              {appliedPromo ? (
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-medium">
                    {appliedPromo.code} ({appliedPromo.percent}% OFF)
                  </span>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <label htmlFor="checkout-promo-code" className="sr-only">
                    Privilege Code
                  </label>
                  <Input
                    id="checkout-promo-code"
                    placeholder="Privilege Code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="h-9 rounded-none text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyPromo}
                    className="h-9 rounded-none text-[10px] uppercase tracking-wider"
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Summary Lines */}
            <div className="space-y-2 border-b border-border/60 pb-5 text-xs text-muted-foreground">
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
                <span>Shipping ({shippingMethod === "express" ? "Express" : "Standard"})</span>
                <span className="text-foreground">
                  {shippingFee === 0 ? "Complimentary" : money(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border/80 pt-3 text-base font-medium text-foreground">
                <span>Estimated Total</span>
                <span>{money(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-6 space-y-3">
              <Button
                form="checkout-form"
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="h-12 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.18em] hover:bg-primary/90"
              >
                {isSubmitting ? "Generating Atelier Order..." : "Confirm & Place Demo Order"}
              </Button>
              <p className="text-center text-[10px] text-muted-foreground">
                No real payment taken · Simulated order saved to this browser
              </p>
            </div>
          </aside>
        </div>
      </section>
    </StoreLayout>
  );
}
