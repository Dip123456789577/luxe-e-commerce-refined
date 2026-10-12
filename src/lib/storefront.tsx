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

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  image: string;
  subtitle: string;
  badge?: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviews: number;
  description: string;
};

export const products: Product[] = [
  { id: "the-linen-dress", name: "The Linen Dress", category: "Clothing", price: 148, image: heroImage, subtitle: "A summer essential, considered.", badge: "Bestseller", colors: ["Ivory", "Olive", "Black"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.9, reviews: 38, description: "Cut from breathable European linen, with a softly sculpted waist and a quietly elegant drape. Made for long afternoons and wherever they lead." },
  { id: "everyday-shoulder-bag", name: "Everyday Shoulder Bag", category: "Bags", price: 195, image: bagImage, subtitle: "Beautifully useful, every day.", badge: "New arrival", colors: ["Cognac", "Black"], sizes: ["One size"], rating: 4.8, reviews: 24, description: "An easy, considered shape in supple pebbled leather. Spacious enough for the everyday, finished with understated brushed-gold details." },
  { id: "the-soft-knit", name: "The Soft Knit", category: "Clothing", price: 168, image: knitImage, subtitle: "Your forever layer.", colors: ["Oat", "Charcoal", "Sage"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.9, reviews: 19, description: "Responsibly sourced merino with a beautiful hand feel and just-right relaxed shape. An all-season layer made to be lived in." },
  { id: "sculpted-vase", name: "Sculpted Ceramic Vase", category: "Home", price: 86, image: homeImage, subtitle: "Art for the everyday.", badge: "Made by hand", colors: ["Chalk", "Stone"], sizes: ["One size"], rating: 4.7, reviews: 16, description: "Hand-finished in a small ceramic studio, each sculptural vessel has its own gentle variation. Lovely with a single stem or on its own." },
  { id: "weekend-knit", name: "Weekend Merino", category: "Clothing", price: 178, image: knitImage, subtitle: "An unhurried kind of luxury.", colors: ["Oat", "Sage"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.8, reviews: 12, description: "A generously soft knit with refined rib detailing, thoughtfully made from natural fibres for years of wear." },
  { id: "the-market-tote", name: "Market Tote", category: "Bags", price: 125, image: bagImage, subtitle: "Room for the little things.", colors: ["Cognac", "Sand"], sizes: ["One size"], rating: 4.6, reviews: 9, description: "A relaxed leather carryall that makes everyday errands a pleasure. Crafted with durable seams and an easy shoulder strap." },
];

export const categories = ["Clothing", "Bags", "Home", "Jewelry"];
export const money = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export type CartItem = { productId: string; quantity: number; size: string; color: string };
type Order = { number: string; date: string; total: number; email: string };
type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  customer: { name: string; email: string } | null;
  hydrated: boolean;
  addToCart: (product: Product, size?: string, color?: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  toggleWishlist: (id: string) => void;
  completeDemoOrder: (email: string) => string;
  saveCustomer: (name: string, email: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const STORAGE_KEY = "luxe-store-v1";
export const cartKey = (item: CartItem) => `${item.productId}__${item.size}__${item.color}`;

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customer, setCustomer] = useState<StoreContextValue["customer"]>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved) as { cart?: CartItem[]; wishlist?: string[]; orders?: Order[]; customer?: StoreContextValue["customer"] };
        setCart(Array.isArray(state.cart) ? state.cart : []);
        setWishlist(Array.isArray(state.wishlist) ? state.wishlist : []);
        setOrders(Array.isArray(state.orders) ? state.orders : []);
        setCustomer(state.customer ?? null);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, wishlist, orders, customer }));
  }, [cart, wishlist, orders, customer, hydrated]);

  const addToCart = useCallback((product: Product, size = product.sizes[0] ?? "One size", color = product.colors[0] ?? "Natural") => {
    setCart((current) => {
      const key = `${product.id}__${size}__${color}`;
      const found = current.find((item) => cartKey(item) === key);
      return found
        ? current.map((item) => cartKey(item) === key ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { productId: product.id, quantity: 1, size, color }];
    });
  }, []);
  const updateQuantity = useCallback((key: string, quantity: number) => setCart((current) => current.map((item) => cartKey(item) === key ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) } : item)), []);
  const removeFromCart = useCallback((key: string) => setCart((current) => current.filter((item) => cartKey(item) !== key)), []);
  const toggleWishlist = useCallback((id: string) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]), []);
  const completeDemoOrder = useCallback((email: string) => {
    const number = `LX-${Date.now().toString().slice(-7)}`;
    const total = cart.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.price ?? 0) * item.quantity, 0);
    setOrders((current) => [{ number, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), total, email }, ...current]);
    setCart([]);
    return number;
  }, [cart]);
  const saveCustomer = useCallback((name: string, email: string) => setCustomer({ name, email }), []);
  const value = useMemo(() => ({ cart, wishlist, orders, customer, hydrated, addToCart, updateQuantity, removeFromCart, toggleWishlist, completeDemoOrder, saveCustomer }), [cart, wishlist, orders, customer, hydrated, addToCart, updateQuantity, removeFromCart, toggleWishlist, completeDemoOrder, saveCustomer]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStorefront() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStorefront must be used inside StorefrontProvider");
  return value;
}
