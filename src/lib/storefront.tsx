import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import bagImage from "@/assets/luxe-product-bag.jpg";
import knitImage from "@/assets/luxe-product-knit.jpg";
import homeImage from "@/assets/luxe-product-home.jpg";
import heroImage from "@/assets/luxe-editorial-hero.jpg";
import loaferImage from "@/assets/luxe-product-loafer.jpg";
import blouseImage from "@/assets/luxe-product-blouse.jpg";
import pendantImage from "@/assets/luxe-product-pendant.jpg";
import cardiganImage from "@/assets/luxe-product-cardigan.jpg";
import candleImage from "@/assets/luxe-product-candle.jpg";

export type ProductReview = {
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
};

export type Product = {
  id: string;
  name: string;
  category: "Clothing" | "Bags" | "Home" | "Jewelry" | "Shoes";
  price: number;
  compareAt?: number | undefined;
  image: string;
  gallery: string[];
  subtitle: string;
  badge?: string | undefined;
  colors: string[];
  sizes: string[];
  rating: number;
  reviews: number;
  description: string;
  craftsmanship?: string | undefined;
  materials?: string | undefined;
  care?: string | undefined;
  origin?: string | undefined;
  customerReviews?: ProductReview[] | undefined;
};

export const products: Product[] = [
  {
    id: "the-linen-dress",
    name: "The Linen Dress",
    category: "Clothing",
    price: 148,
    image: heroImage,
    gallery: [
      heroImage,
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "A summer essential, considered.",
    badge: "Bestseller",
    colors: ["Ivory", "Olive", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 38,
    description:
      "Cut from certified Normandy flax linen, featuring a sculpted waistline and a natural, fluid drape. Tailored with French interior seams for an unhurried, timeless silhouette.",
    craftsmanship:
      "Garment-washed for a soft broken-in feel from the first wear. Finished with mother-of-pearl buttons and discreet side pockets.",
    materials: "100% European Certified Flax Linen (190 gsm)",
    care: "Gentle machine wash cold with gentle detergent. Line dry in shade. Warm iron if desired.",
    origin: "Woven in Normandy, tailored in Porto, Portugal",
    customerReviews: [
      {
        author: "Camille V.",
        rating: 5,
        date: "October 2026",
        title: "Absolute perfection in linen",
        comment:
          "The weight of the linen is exceptional. It breathes gracefully in heat while holding its tailored shape through long dinners.",
        verified: true,
      },
      {
        author: "Eleanor P.",
        rating: 5,
        date: "September 2026",
        title: "Subtle elegance",
        comment:
          "The olive tone is earthy and refined. I reach for this dress constantly for both gallery openings and Sunday markets.",
        verified: true,
      },
    ],
  },
  {
    id: "everyday-shoulder-bag",
    name: "Everyday Shoulder Bag",
    category: "Bags",
    price: 195,
    compareAt: 240,
    image: bagImage,
    gallery: [
      bagImage,
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "Supple Tuscan leather, engineered for utility.",
    badge: "New arrival",
    colors: ["Cognac", "Noir Black", "Chalk"],
    sizes: ["One size"],
    rating: 4.8,
    reviews: 24,
    description:
      "An understated sculptural bag crafted from vegetable-tanned full-grain leather. Finished with brushed palladium hardware and an interior cotton canvas zip pocket.",
    craftsmanship:
      "Hand-burnished edge paint and reinforced stress points ensure longevity that patinas beautifully across seasons.",
    materials: "100% Tuscan Full-Grain Vegetable-Tanned Leather, Japanese YKK Brass Zipper",
    care: "Condition semi-annually with natural beeswax leather cream. Store in provided cotton dust bag.",
    origin: "Handcrafted in Florence, Italy",
    customerReviews: [
      {
        author: "Sophia R.",
        rating: 5,
        date: "October 2026",
        title: "The ideal everyday proportions",
        comment:
          "Fits my 13-inch notebook, wallet, keys, and water bottle without looking bulky. The cognac color develops a gorgeous luster.",
        verified: true,
      },
    ],
  },
  {
    id: "the-soft-knit",
    name: "The Soft Knit Crew",
    category: "Clothing",
    price: 168,
    image: knitImage,
    gallery: [
      knitImage,
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "Extra-fine merino with an effortless drape.",
    badge: "Iconic",
    colors: ["Oat", "Charcoal", "Sage"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 29,
    description:
      "Spun from ultra-fine 19.5-micron Australian merino wool. Knit at a featherweight gauge with delicate ribbed collar and saddle shoulders for ease of movement.",
    craftsmanship:
      "Seamless whole-garment 3D knitting technology minimizes yarn waste and eliminates interior seam friction.",
    materials: "100% Traceable Extra-Fine Merino Wool (Woolmark Certified)",
    care: "Hand wash in cool water with wool wash. Lay flat on towel to dry. Do not tumble dry.",
    origin: "Spun in Biella, Italy",
    customerReviews: [
      {
        author: "Julian T.",
        rating: 5,
        date: "September 2026",
        title: "Weightless warmth",
        comment: "Zero itch, heavenly hand feel. Truly one of the finest knits in my wardrobe.",
        verified: true,
      },
    ],
  },
  {
    id: "sculpted-vase",
    name: "Sculpted Ceramic Vessel",
    category: "Home",
    price: 86,
    image: homeImage,
    gallery: [
      homeImage,
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "Raw stoneware, tactile form.",
    badge: "Made by hand",
    colors: ["Chalk", "Stone Gray"],
    sizes: ["Standard (24cm)", "Grand (32cm)"],
    rating: 4.7,
    reviews: 16,
    description:
      "Hand-thrown ceramic vase with subtle organic asymmetry. Matte exterior textured slip glaze and watertight glossy interior for botanicals.",
    craftsmanship:
      "Fired in wood-burning kilns over 36 hours. Each vessel possesses unique glaze smoke variations.",
    materials: "Coarse regional stoneware with mineral slip glaze",
    care: "Rinse with lukewarm water and mild soap. Hand wash recommended.",
    origin: "Crafted in Kyoto, Japan",
  },
  {
    id: "weekend-knit",
    name: "Weekend Merino Cardigan",
    category: "Clothing",
    price: 178,
    compareAt: 210,
    image: cardiganImage,
    gallery: [cardiganImage, knitImage],
    subtitle: "Generous ribbed detailing, horn buttons.",
    colors: ["Oat", "Sage", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 18,
    description:
      "A slouchy, comfortable cardigan knit from chunky carded merino. Features dropped shoulders, deep pockets, and ethically sourced natural horn buttons.",
    craftsmanship: "Fully fashioned rib knit with hand-linked placket.",
    materials: "100% RWS Certified Merino Wool",
    care: "Dry clean or gentle cold hand wash.",
    origin: "Knitted in Hawick, Scotland",
  },
  {
    id: "the-market-tote",
    name: "Minimalist Market Tote",
    category: "Bags",
    price: 125,
    image: bagImage,
    gallery: [
      bagImage,
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "Heavyweight organic canvas and bridle leather handles.",
    colors: ["Natural / Cognac", "Black Monolith"],
    sizes: ["One size"],
    rating: 4.6,
    reviews: 14,
    description:
      "An unpretentious everyday carryall. 18oz waterproofed organic cotton duck canvas with bridle leather straps riveted with solid copper studs.",
    craftsmanship: "Copper hand-hammered rivets and reinforced triple-needle stitching.",
    materials: "18oz Organic Cotton Duck, English Bridle Leather",
    care: "Spot clean with damp cloth and mild saddle soap.",
    origin: "Handcrafted in Somerset, England",
  },
  {
    id: "solstice-gold-pendant",
    name: "Solstice Hammered Pendant",
    category: "Jewelry",
    price: 220,
    compareAt: 260,
    image: pendantImage,
    gallery: [
      pendantImage,
      "https://images.unsplash.com/photo-1611591475152-4c4897f7fa20?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "Recycled 18k solid gold vermeil over 925 silver.",
    badge: "Atelier Edition",
    colors: ["18k Gold", "Sterling Silver"],
    sizes: ["45cm Chain", "50cm Chain"],
    rating: 5.0,
    reviews: 21,
    description:
      "An organic disc pendant delicately hand-hammered by master jewelers. Suspended on a fluid cable chain with an adjustable clasp and hallmark stamp.",
    craftsmanship: "Thick 3.5-micron gold layer over recycled 925 sterling silver base.",
    materials: "Recycled 18k Yellow Gold Vermeil, 925 Sterling Silver",
    care: "Store in airtight pouch. Clean gently with microfibre polishing cloth.",
    origin: "Crafted in Arezzo, Italy",
  },
  {
    id: "silk-atelier-shirt",
    name: "Tailored Silk Blouse",
    category: "Clothing",
    price: 210,
    image: blouseImage,
    gallery: [
      blouseImage,
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "Heavyweight mulberry silk with matte sandwashed finish.",
    badge: "New arrival",
    colors: ["Champagne", "Noir Black", "Ivory"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 22,
    description:
      "A classic collared button-down with clean covered plackets and French cuffs. Sandwashed for a liquid, non-sheer drape with a subtle peachskin touch.",
    craftsmanship: "Silk crepe de chine 22-momme weight, hand-sewn mother-of-pearl buttons.",
    materials: "100% Grade 6A Mulberry Silk",
    care: "Dry clean or hand wash inside-out in silk shampoo.",
    origin: "Woven in Hangzhou, tailored in Paris",
  },
  {
    id: "minimalist-leather-loafer",
    name: "The Essential Leather Loafer",
    category: "Shoes",
    price: 265,
    compareAt: 320,
    image: loaferImage,
    gallery: [
      loaferImage,
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "Glove leather with Blake-stitched leather sole.",
    badge: "Bestseller",
    colors: ["Noir Black", "Burgundy", "Cognac"],
    sizes: ["36 EU", "37 EU", "38 EU", "39 EU", "40 EU", "41 EU"],
    rating: 4.8,
    reviews: 31,
    description:
      "Molded around an almond-toe wooden last. Supple French calfskin upper with cushioned leather insole designed to mold to your foot contours over wear.",
    craftsmanship: "Traditional Blake stitch construction, replaceable stacked leather heel.",
    materials: "Full-Grain French Calfskin, Natural Calf Lining, Vegetable-Tanned Leather Sole",
    care: "Insert cedar shoe trees between wears. Polish with cream wax.",
    origin: "Handcrafted in Montegranaro, Italy",
  },
  {
    id: "amber-botanical-candle",
    name: "Cedar & Amber Botanical Candle",
    category: "Home",
    price: 58,
    image: candleImage,
    gallery: [
      candleImage,
      "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "Hand-poured coconut wax with pure botanical oils.",
    badge: "Hand poured",
    colors: ["Amber Glass", "Smoked Onyx"],
    sizes: ["280g (65 Hours Burn)"],
    rating: 4.9,
    reviews: 42,
    description:
      "A slow-burning room fragrance evoking aged cedar panels, smoked frankincense, dried bergamot peel, and warm golden amber resin. Clean lead-free cotton wick.",
    craftsmanship: "Poured by hand in small 24-piece batches in Provence.",
    materials: "100% Sustainable Coconut & Rapeseed Wax Blend, Essential Fragrance Oils",
    care: "Trim wick to 5mm before every lighting. Burn for 2–3 hours on initial use.",
    origin: "Grasse, France",
  },
  {
    id: "tapered-wool-trousers",
    name: "Pleated Atelier Trousers",
    category: "Clothing",
    price: 195,
    image:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "High-waist double pleat in breathable tropical wool.",
    badge: "Refined Cut",
    colors: ["Charcoal", "Oatmeal Melange", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 17,
    description:
      "Architectural trousers with a fluid drape through the leg and a gentle ankle taper. Detailed with horn buttons and an adjustable internal waistband cinch.",
    craftsmanship: "Half-lined with Bemberg cupro for anti-static drape.",
    materials: "100% Super 120s Tropical Wool, 100% Cupro Lining",
    care: "Dry clean only. Steam gently between wears.",
    origin: "Tailored in Biella, Italy",
  },
  {
    id: "atelier-cashmere-throw",
    name: "Pure Cashmere Atelier Throw",
    category: "Home",
    price: 285,
    compareAt: 350,
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85",
    ],
    subtitle: "Weightless Inner Mongolian Grade-A cashmere.",
    badge: "Limited Run",
    colors: ["Ivory", "Heather Taupe"],
    sizes: ["140cm × 180cm"],
    rating: 5.0,
    reviews: 15,
    description:
      "A sumptuous heirloom blanket with delicate eyelash fringe edges. Softly brushed using natural dried teasels to achieve an airy cloud-like loft.",
    craftsmanship: "Traditionally loomed with 38mm staple length fibers.",
    materials: "100% Pure Mongolian Cashmere (Sustainable Sourcing)",
    care: "Professional dry clean only. Brush occasionally with a cashmere comb.",
    origin: "Loomed in Scotland",
  },
];

export const categories: Product["category"][] = ["Clothing", "Bags", "Home", "Jewelry", "Shoes"];

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 155,
};

export const money = (amount: number, currency: CurrencyCode = "USD") => {
  const rate = CURRENCY_RATES[currency] ?? 1;
  const converted = Math.round(amount * rate);
  if (currency === "JPY") {
    return `¥${converted.toLocaleString("ja-JP")}`;
  }
  if (currency === "EUR") {
    return `${converted.toLocaleString("de-DE")} €`;
  }
  if (currency === "GBP") {
    return `£${converted.toLocaleString("en-GB")}`;
  }
  return `$${converted.toLocaleString("en-US")}`;
};

export const getColorHex = (name: string): string => {
  const map: Record<string, string> = {
    Ivory: "#F8F5EE",
    Olive: "#5D624E",
    Black: "#171717",
    "Noir Black": "#121212",
    Cognac: "#965934",
    Chalk: "#EBE7DF",
    Oat: "#D8CDBF",
    Charcoal: "#2F3132",
    Sage: "#8B9582",
    "Stone Gray": "#949089",
    "Natural / Cognac": "#DCCBB5",
    "Black Monolith": "#1A1A1A",
    "18k Gold": "#D4AF37",
    "Sterling Silver": "#C8C9CC",
    Champagne: "#E8DCBF",
    Burgundy: "#4A1521",
    "Amber Glass": "#A36B36",
    "Smoked Onyx": "#222222",
    "Oatmeal Melange": "#C9BEAF",
    "Heather Taupe": "#A89F93",
  };
  return map[name] ?? "#DDD8CF";
};

export type CartItem = {
  productId: string;
  quantity: number;
  size: string;
  color: string;
  monogram?: string | undefined;
  foilStyle?: string | undefined;
};

export type Order = {
  number: string;
  date: string;
  total: number;
  email: string;
  itemsCount: number;
  status: "Confirmed" | "Preparing in Atelier" | "Dispatched" | "Delivered";
  city?: string | undefined;
  shippingMethod?: string | undefined;
};

export type CustomerProfile = {
  name: string;
  email: string;
  tier: "Luxe Privé" | "Atelier Member" | "Collector" | "Atelier Director (Admin)";
  shippingAddress?: string | undefined;
  phone?: string | undefined;
};

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  customer: CustomerProfile | null;
  recentlyViewed: string[];
  appliedPromo: { code: string; percent: number } | null;
  giftPackaging: boolean;
  hydrated: boolean;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (amount: number) => string;
  isConciergeOpen: boolean;
  setIsConciergeOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    size?: string,
    color?: string,
    quantity?: number,
    monogram?: string,
    foilStyle?: string,
  ) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  recordRecentlyViewed: (id: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  toggleGiftPackaging: () => void;
  completeDemoOrder: (details: {
    email: string;
    shippingCity?: string;
    shippingMethod?: string;
  }) => string;
  saveCustomer: (profile: Partial<CustomerProfile>) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const STORAGE_KEY = "luxe-store-v2";

export const cartKey = (item: CartItem) =>
  `${item.productId}__${item.size}__${item.color}${item.monogram ? `__${item.monogram}_${item.foilStyle ?? "gold"}` : ""}`;

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customer, setCustomer] = useState<CustomerProfile | null>({
    name: "Clara Moreau",
    email: "clara.moreau@atelier-luxe.com",
    tier: "Luxe Privé",
    shippingAddress: "740 Park Avenue, Apt 11B, New York, NY 10021",
    phone: "+1 (212) 555-0198",
  });
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([
    "the-linen-dress",
    "everyday-shoulder-bag",
  ]);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [hydrated, setHydrated] = useState(false);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
  }, []);

  const formatPrice = useCallback((amount: number) => money(amount, currency), [currency]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        if (Array.isArray(state.cart)) setCart(state.cart);
        if (Array.isArray(state.wishlist)) setWishlist(state.wishlist);
        if (Array.isArray(state.orders)) setOrders(state.orders);
        if (state.customer) setCustomer(state.customer);
        if (Array.isArray(state.recentlyViewed)) setRecentlyViewed(state.recentlyViewed);
        if (state.appliedPromo) setAppliedPromo(state.appliedPromo);
        if (typeof state.giftPackaging === "boolean") setGiftPackaging(state.giftPackaging);
        if (state.currency && ["USD", "EUR", "GBP", "JPY"].includes(state.currency)) {
          setCurrencyState(state.currency);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          cart,
          wishlist,
          orders,
          customer,
          recentlyViewed,
          appliedPromo,
          giftPackaging,
          currency,
        }),
      );
    }
  }, [
    cart,
    wishlist,
    orders,
    customer,
    recentlyViewed,
    appliedPromo,
    giftPackaging,
    currency,
    hydrated,
  ]);

  const addToCart = useCallback(
    (
      product: Product,
      size = product.sizes[0] ?? "One size",
      color = product.colors[0] ?? "Natural",
      quantity = 1,
      monogram?: string,
      foilStyle?: string,
    ) => {
      setCart((current) => {
        const key = `${product.id}__${size}__${color}${monogram ? `__${monogram}_${foilStyle ?? "gold"}` : ""}`;
        const found = current.find((item) => cartKey(item) === key);
        if (found) {
          return current.map((item) =>
            cartKey(item) === key ? { ...item, quantity: item.quantity + quantity } : item,
          );
        }
        return [
          ...current,
          {
            productId: product.id,
            quantity,
            size,
            color,
            monogram: monogram || undefined,
            foilStyle: foilStyle || undefined,
          },
        ];
      });
      setIsCartDrawerOpen(true);
    },
    [],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((current) =>
      current.map((item) =>
        cartKey(item) === key ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) } : item,
      ),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((current) => current.filter((item) => cartKey(item) !== key));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const isInWishlist = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const recordRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => [id, ...prev.filter((item) => item !== id)].slice(0, 8));
  }, []);

  const applyPromoCode = useCallback((code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "WELCOME10") {
      setAppliedPromo({ code: clean, percent: 10 });
      return { success: true, message: "Welcome gift: 10% applied to your bag." };
    }
    if (clean === "LUXE20") {
      setAppliedPromo({ code: clean, percent: 20 });
      return { success: true, message: "Atelier VIP: 20% privilege applied." };
    }
    return { success: false, message: "Code not recognized. Try WELCOME10 or LUXE20." };
  }, []);

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
  }, []);

  const toggleGiftPackaging = useCallback(() => {
    setGiftPackaging((prev) => !prev);
  }, []);

  const completeDemoOrder = useCallback(
    ({
      email,
      shippingCity = "New York",
      shippingMethod = "Express Courier",
    }: {
      email: string;
      shippingCity?: string;
      shippingMethod?: string;
    }) => {
      const number = `LX-${Math.floor(100000 + Math.random() * 900000)}`;
      const subtotal = cart.reduce(
        (sum, item) =>
          sum +
          (products.find((product) => product.id === item.productId)?.price ?? 0) * item.quantity,
        0,
      );
      const discount = appliedPromo ? Math.round((subtotal * appliedPromo.percent) / 100) : 0;
      const total = Math.max(0, subtotal - discount);
      const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

      const newOrder: Order = {
        number,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        total,
        email,
        itemsCount,
        status: "Confirmed",
        city: shippingCity,
        shippingMethod,
      };

      setOrders((current) => [newOrder, ...current]);
      setCart([]);
      return number;
    },
    [cart, appliedPromo],
  );

  const saveCustomer = useCallback((profile: Partial<CustomerProfile>) => {
    setCustomer((prev) => ({
      name: profile.name ?? prev?.name ?? "Client",
      email: profile.email ?? prev?.email ?? "",
      tier: profile.tier ?? prev?.tier ?? "Luxe Privé",
      shippingAddress: profile.shippingAddress ?? prev?.shippingAddress,
      phone: profile.phone ?? prev?.phone,
    }));
  }, []);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      orders,
      customer,
      recentlyViewed,
      appliedPromo,
      giftPackaging,
      hydrated,
      currency,
      setCurrency,
      formatPrice,
      isConciergeOpen,
      setIsConciergeOpen,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      recordRecentlyViewed,
      applyPromoCode,
      removePromoCode,
      toggleGiftPackaging,
      completeDemoOrder,
      saveCustomer,
    }),
    [
      cart,
      wishlist,
      orders,
      customer,
      recentlyViewed,
      appliedPromo,
      giftPackaging,
      hydrated,
      currency,
      setCurrency,
      formatPrice,
      isConciergeOpen,
      setIsConciergeOpen,
      isCartDrawerOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      recordRecentlyViewed,
      applyPromoCode,
      removePromoCode,
      toggleGiftPackaging,
      completeDemoOrder,
      saveCustomer,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStorefront() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStorefront must be used inside StorefrontProvider");
  return value;
}
