import { useState, useEffect, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  AlertTriangle,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreLayout } from "@/components/storefront";
import { adminApi, authApi, type ApiResponse } from "@/lib/api";
import { money } from "@/lib/storefront";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Atelier Director Console | LUXE Admin" },
      {
        name: "description",
        content: "Executive administrative dashboard for LUXE Atelier operations.",
      },
      { property: "og:title", content: "Atelier Director Console | LUXE Admin" },
    ],
  }),
  component: AdminPage,
});

type DashboardOverview = {
  totalOrders: number;
  grossSales: number;
  customersCount: number;
  productsCount: number;
  lowStockCount: number;
  lowStockProducts: Array<{ _id: string; name: string; stock: number; sku: string; price: number }>;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    paymentStatus: string;
    fulfillmentStatus: string;
    createdAt: string;
  }>;
};

type AdminProduct = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  isPublished: boolean;
  images: string[];
};

type AdminOrder = {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; size: string; color: string; price: number }>;
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber?: string;
  createdAt: string;
};

type AdminCoupon = {
  _id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  usedCount: number;
  isActive: boolean;
};

function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "orders" | "coupons">(
    "overview",
  );

  // Dashboard Data
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(false);

  // New Product Modal State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductSku, setNewProductSku] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Clothing");
  const [newProductPrice, setNewProductPrice] = useState("180");
  const [newProductStock, setNewProductStock] = useState("15");
  const [newProductImage, setNewProductImage] = useState(
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85",
  );
  const [newProductDescription, setNewProductDescription] = useState(
    "Bespoke piece tailored in our European workshops.",
  );

  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Order Status Edit State
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // New Coupon Modal State
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponPercent, setNewCouponPercent] = useState("15");

  // Check Admin Login
  useEffect(() => {
    async function verify() {
      try {
        const res = await authApi.getMe();
        if (res.success && (res.user as { role: string })?.role === "ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    void verify();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ovRes, prodRes, ordRes, coupRes] = await Promise.all([
        adminApi.getOverview().catch((): ApiResponse => ({ success: false })),
        adminApi.getProducts().catch((): ApiResponse => ({ success: false })),
        adminApi.getOrders().catch((): ApiResponse => ({ success: false })),
        adminApi.getCoupons().catch((): ApiResponse => ({ success: false })),
      ]);

      if (ovRes.success && ovRes.data) setOverview(ovRes.data as DashboardOverview);
      if (prodRes.success && prodRes.data) setProducts(prodRes.data as AdminProduct[]);
      if (ordRes.success && ordRes.data) setOrders(ordRes.data as AdminOrder[]);
      if (coupRes.success && coupRes.data) setCoupons(coupRes.data as AdminCoupon[]);
    } catch {
      toast.error("Failed to load director telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      void loadData();
    }
  }, [isAdmin]);

  const handleAdminQuickLogin = async () => {
    try {
      const res = await authApi.login({
        email: "admin@atelier-luxe.com",
        password: "AdminPassword2026!",
      });
      if (res.success && res.user?.role === "ADMIN") {
        setIsAdmin(true);
        toast.success("Authenticated as Atelier Director.");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Admin authorization failed.");
    }
  };

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createProduct({
        name: newProductName,
        sku: newProductSku,
        category: newProductCategory,
        price: parseFloat(newProductPrice),
        stock: parseInt(newProductStock, 10),
        images: [newProductImage],
        description: newProductDescription,
        subtitle: "Artisan commission piece",
        colors: ["Ivory", "Noir Black"],
        sizes: ["S", "M", "L"],
      });
      if (res.success) {
        toast.success("Piece cataloged into inventory.");
        setShowAddProduct(false);
        void loadData();
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to create piece.");
    }
  };

  const handleUpdateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await adminApi.updateProduct(editingProduct._id, {
        name: editingProduct.name,
        price: editingProduct.price,
        stock: editingProduct.stock,
        isPublished: editingProduct.isPublished,
      });
      if (res.success) {
        toast.success("Product updated successfully.");
        setEditingProduct(null);
        void loadData();
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Update failed.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you wish to archive and remove this product?")) return;
    try {
      const res = await adminApi.deleteProduct(id);
      if (res.success) {
        toast.success("Product removed from inventory.");
        void loadData();
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Delete failed.");
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: string,
    trackingNumber?: string,
  ) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await adminApi.updateOrderStatus(orderId, {
        fulfillmentStatus: status,
        trackingNumber: trackingNumber || undefined,
      });
      if (res.success) {
        toast.success(`Order ${status.toLowerCase()} updated.`);
        void loadData();
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Fulfillment transition failed.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCreateCoupon = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createCoupon({
        code: newCouponCode.toUpperCase().trim(),
        discountType: "PERCENTAGE",
        discountValue: parseFloat(newCouponPercent),
        minOrderValue: 50,
      });
      if (res.success) {
        toast.success(`Coupon ${newCouponCode} active.`);
        setShowAddCoupon(false);
        setNewCouponCode("");
        void loadData();
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to issue privilege coupon.");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      const res = await adminApi.deleteCoupon(id);
      if (res.success) {
        toast.success("Privilege coupon revoked.");
        void loadData();
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Revocation failed.");
    }
  };

  if (checkingAuth) {
    return (
      <StoreLayout>
        <section className="page-width py-24 text-center">
          <RefreshCw className="mx-auto size-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
            Verifying Director Clearance...
          </p>
        </section>
      </StoreLayout>
    );
  }

  if (!isAdmin) {
    return (
      <StoreLayout>
        <section className="page-width py-20 sm:py-28">
          <div className="mx-auto max-w-md border border-border/80 bg-card p-8 text-center sm:p-10">
            <ShieldAlert className="mx-auto size-12 text-champagne" />
            <h1 className="mt-4 font-serif text-3xl font-light text-foreground">
              Director Authorization Required
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              This operational console is restricted to Atelier Directors and authorized curators.
            </p>

            <div className="mt-8 space-y-4">
              <Button
                type="button"
                onClick={() => void handleAdminQuickLogin()}
                className="h-12 w-full rounded-none bg-primary text-[10px] uppercase tracking-[0.2em]"
              >
                Sign In as Atelier Director (Demo)
              </Button>

              <Link
                to="/login"
                className="block text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Sign in with alternate credentials
              </Link>
            </div>
          </div>
        </section>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <section className="page-width py-10 sm:py-16">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Atelier Management Console
            </span>
            <h1 className="mt-1 font-serif text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              Director Dashboard
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Live inventory balances, real-time client acquisition orders, and privilege codes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadData()}
              disabled={loading}
              className="h-9 rounded-none text-[10px] uppercase tracking-wider"
            >
              <RefreshCw className={`mr-1.5 size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddProduct(true)}
              className="h-9 rounded-none bg-primary text-[10px] uppercase tracking-wider"
            >
              <Plus className="mr-1.5 size-3.5" /> Catalog New Piece
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex gap-2 border-b border-border/70 pb-px">
          {[
            { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
            { id: "inventory", label: `Inventory (${products.length})`, icon: Package },
            { id: "orders", label: `Client Orders (${orders.length})`, icon: ShoppingBag },
            { id: "coupons", label: `Privilege Codes (${coupons.length})`, icon: Ticket },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as never)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? "border-foreground font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            {/* Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border border-border/80 bg-card p-6">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Gross Acquisitions
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-light text-foreground">
                    {money(overview?.grossSales ?? 0)}
                  </span>
                  <TrendingUp className="size-4 text-emerald-700" />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Settled client transactions
                </p>
              </div>

              <div className="border border-border/80 bg-card p-6">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Total Orders
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-light text-foreground">
                    {overview?.totalOrders ?? orders.length}
                  </span>
                  <ShoppingBag className="size-4 text-foreground/60" />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">All atelier monographs</p>
              </div>

              <div className="border border-border/80 bg-card p-6">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Active Collectors
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-light text-foreground">
                    {overview?.customersCount ?? 1}
                  </span>
                  <Users className="size-4 text-foreground/60" />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Registered client accounts</p>
              </div>

              <div className="border border-border/80 bg-card p-6">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Low Stock Watch
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-light text-amber-700">
                    {overview?.lowStockCount ?? 0}
                  </span>
                  <AlertTriangle className="size-4 text-amber-600" />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Pieces under 5 reserves</p>
              </div>
            </div>

            {/* Low Stock Warning Banner */}
            {(overview?.lowStockCount ?? 0) > 0 && (
              <div className="border border-amber-300 bg-amber-50/60 p-4 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-medium">
                  <AlertTriangle className="size-4 text-amber-700" />
                  <span>Inventory Replenishment Notice</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed">
                  The following pieces are nearing atelier depletion:{" "}
                  {overview?.lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).join(", ")}.
                </p>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="border border-border/80 bg-card">
              <div className="border-b border-border/60 p-5">
                <h3 className="font-serif text-lg font-light text-foreground">
                  Recent Commission Monographs
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="p-4">Monograph #</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-muted-foreground">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord._id}>
                        <td className="p-4 font-mono font-medium text-foreground">
                          {ord.orderNumber}
                        </td>
                        <td className="p-4 text-foreground">{ord.customerName}</td>
                        <td className="p-4 font-medium text-foreground">{money(ord.total)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                              ord.paymentStatus === "PAID"
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-sand text-foreground">
                            {ord.fulfillmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No recent acquisitions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY */}
        {activeTab === "inventory" && (
          <div className="mt-8 border border-border/80 bg-card">
            <div className="flex items-center justify-between border-b border-border/60 p-5">
              <h3 className="font-serif text-lg font-light text-foreground">
                Atelier Catalog & Reserves
              </h3>
              <Button
                size="sm"
                onClick={() => setShowAddProduct(true)}
                className="h-8 rounded-none bg-primary text-[10px] uppercase tracking-wider"
              >
                <Plus className="mr-1 size-3" /> New Piece
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="p-4">Piece</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Reserves</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-muted/20">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images?.[0] || "/placeholder.jpg"}
                            alt={prod.name}
                            className="size-10 object-cover border border-border"
                          />
                          <div>
                            <span className="font-medium text-foreground block">{prod.name}</span>
                            <span className="text-[10px] text-muted-foreground">/{prod.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px]">{prod.sku}</td>
                      <td className="p-4">{prod.category}</td>
                      <td className="p-4 font-medium text-foreground">{money(prod.price)}</td>
                      <td className="p-4">
                        <span
                          className={`font-medium ${
                            prod.stock <= 5 ? "text-amber-700 font-bold" : "text-foreground"
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                            prod.isPublished
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {prod.isPublished ? "Cataloged" : "Hidden"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(prod)}
                            className="p-1 hover:text-foreground"
                            title="Edit Piece"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteProduct(prod._id)}
                            className="p-1 text-destructive/70 hover:text-destructive"
                            title="Archive Piece"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS FULFILLMENT */}
        {activeTab === "orders" && (
          <div className="mt-8 border border-border/80 bg-card">
            <div className="border-b border-border/60 p-5">
              <h3 className="font-serif text-lg font-light text-foreground">
                Client Commissions & Fulfillment Log
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="p-4">Monograph #</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status & Transition</th>
                    <th className="p-4">Tracking Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-muted/20">
                      <td className="p-4 font-mono font-medium text-foreground">
                        {ord.orderNumber}
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-foreground block">
                          {ord.customerName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {ord.customerEmail}
                        </span>
                      </td>
                      <td className="p-4 text-[11px]">
                        {ord.items.map((i) => `${i.name} (${i.size}) ×${i.quantity}`).join(", ")}
                      </td>
                      <td className="p-4 font-medium text-foreground">{money(ord.total)}</td>
                      <td className="p-4">
                        <select
                          value={ord.fulfillmentStatus}
                          onChange={(e) =>
                            void handleUpdateOrderStatus(
                              ord._id,
                              e.target.value,
                              ord.trackingNumber,
                            )
                          }
                          disabled={updatingOrderId === ord._id}
                          className="h-8 rounded-none border border-border bg-background px-2 text-[10px] uppercase tracking-wider text-foreground"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PREPARING_IN_ATELIER">PREPARING_IN_ATELIER</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Input
                            defaultValue={ord.trackingNumber || ""}
                            onBlur={(e) => {
                              if (e.target.value !== (ord.trackingNumber || "")) {
                                void handleUpdateOrderStatus(
                                  ord._id,
                                  ord.fulfillmentStatus,
                                  e.target.value,
                                );
                              }
                            }}
                            placeholder="e.g. LX-DHL-892"
                            className="h-7 w-28 rounded-none text-[10px]"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No client commission records present.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === "coupons" && (
          <div className="mt-8 border border-border/80 bg-card">
            <div className="flex items-center justify-between border-b border-border/60 p-5">
              <h3 className="font-serif text-lg font-light text-foreground">
                Privilege Codes & Atelier Invitations
              </h3>
              <Button
                size="sm"
                onClick={() => setShowAddCoupon(true)}
                className="h-8 rounded-none bg-primary text-[10px] uppercase tracking-wider"
              >
                <Plus className="mr-1 size-3" /> Issue Privilege Code
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="p-4">Code</th>
                    <th className="p-4">Privilege Value</th>
                    <th className="p-4">Redemptions</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  {coupons.map((c) => (
                    <tr key={c._id} className="hover:bg-muted/20">
                      <td className="p-4 font-mono font-medium text-foreground">{c.code}</td>
                      <td className="p-4 font-medium text-foreground">{c.discountValue}% Off</td>
                      <td className="p-4">{c.usedCount} client redemptions</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                            c.isActive
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {c.isActive ? "Active" : "Archived"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => void handleDeleteCoupon(c._id)}
                          className="p-1 text-destructive/70 hover:text-destructive"
                          title="Revoke Code"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No promo codes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: ADD PRODUCT */}
        {showAddProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-serif text-xl font-light text-foreground">
                  Catalog New Atelier Piece
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-foreground">Piece Name</label>
                  <Input
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="e.g. Sculpted Silk Kimono"
                    className="mt-1 h-9 rounded-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-foreground">SKU Code</label>
                    <Input
                      required
                      value={newProductSku}
                      onChange={(e) => setNewProductSku(e.target.value)}
                      placeholder="LX-CLO-099"
                      className="mt-1 h-9 rounded-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground">Category</label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="mt-1 h-9 w-full rounded-none border border-border bg-background px-2 text-xs"
                    >
                      <option value="Clothing">Clothing</option>
                      <option value="Bags">Bags</option>
                      <option value="Home">Home</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Shoes">Shoes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-foreground">Price ($ USD)</label>
                    <Input
                      required
                      type="number"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="mt-1 h-9 rounded-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground">Initial Stock</label>
                    <Input
                      required
                      type="number"
                      value={newProductStock}
                      onChange={(e) => setNewProductStock(e.target.value)}
                      className="mt-1 h-9 rounded-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-foreground">Image URL</label>
                  <Input
                    required
                    value={newProductImage}
                    onChange={(e) => setNewProductImage(e.target.value)}
                    className="mt-1 h-9 rounded-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-foreground">Description</label>
                  <textarea
                    rows={3}
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    className="mt-1 w-full border border-border bg-background p-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddProduct(false)}
                    className="rounded-none text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-none bg-primary text-xs uppercase tracking-wider"
                  >
                    Publish to Catalog
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT PRODUCT */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-serif text-xl font-light text-foreground">
                  Update Piece: {editingProduct.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-foreground">Piece Name</label>
                  <Input
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="mt-1 h-9 rounded-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-foreground">Price ($ USD)</label>
                    <Input
                      required
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="mt-1 h-9 rounded-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground">Inventory Reserves</label>
                    <Input
                      required
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="mt-1 h-9 rounded-none text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="edit-published"
                    checked={editingProduct.isPublished}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isPublished: e.target.checked })
                    }
                    className="size-4"
                  />
                  <label htmlFor="edit-published" className="text-xs text-foreground">
                    Cataloged and visible in storefront
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProduct(null)}
                    className="rounded-none text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-none bg-primary text-xs uppercase tracking-wider"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD COUPON */}
        {showAddCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-serif text-xl font-light text-foreground">
                  Issue Privilege Code
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddCoupon(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-foreground">Code (Uppercase)</label>
                  <Input
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="VIP25"
                    className="mt-1 h-9 rounded-none font-mono uppercase text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-foreground">Discount Percent (%)</label>
                  <Input
                    required
                    type="number"
                    min="1"
                    max="100"
                    value={newCouponPercent}
                    onChange={(e) => setNewCouponPercent(e.target.value)}
                    className="mt-1 h-9 rounded-none text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddCoupon(false)}
                    className="rounded-none text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-none bg-primary text-xs uppercase tracking-wider"
                  >
                    Activate Code
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </StoreLayout>
  );
}
