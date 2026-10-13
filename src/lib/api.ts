export const API_BASE = "/api/v1";

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: UserPayload;
  resetToken?: string;
  guestToken?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface RequestOptions extends RequestInit {
  data?: unknown;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const guestToken =
    typeof window !== "undefined"
      ? localStorage.getItem("luxe_guest_token") ||
        (() => {
          const t = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          localStorage.setItem("luxe_guest_token", t);
          return t;
        })()
      : undefined;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(guestToken ? { "x-guest-token": guestToken } : {}),
    ...(options.headers as Record<string, string>),
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("luxe_token") : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // sends HttpOnly cookies automatically
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const result = await res.json().catch(() => ({
      success: false,
      message: `Failed to parse response (HTTP ${res.status})`,
    }));

    if (!res.ok) {
      throw new Error(result.message || `Request failed with status ${res.status}`);
    }

    return result;
  } catch (err) {
    console.warn(`[API] ${endpoint} request failed:`, err);
    throw err;
  }
}

/* Auth Services */
export const authApi = {
  async register(data: { name: string; email: string; password: string; confirmPassword: string }) {
    const res = await apiRequest<{ id: string; email: string; name: string; role: string }>(
      "/auth/register",
      { method: "POST", data },
    );
    if (res.token && typeof window !== "undefined") {
      localStorage.setItem("luxe_token", String(res.token));
    }
    return res;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiRequest<{ id: string; email: string; name: string; role: string }>(
      "/auth/login",
      { method: "POST", data },
    );
    if (res.token && typeof window !== "undefined") {
      localStorage.setItem("luxe_token", String(res.token));
    }
    return res;
  },

  async logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("luxe_token");
    }
    return apiRequest("/auth/logout", { method: "POST" });
  },

  async getMe() {
    return apiRequest("/auth/me");
  },

  async forgotPassword(email: string) {
    return apiRequest("/auth/forgot-password", { method: "POST", data: { email } });
  },

  async resetPassword(data: { token: string; password: string; confirmPassword: string }) {
    return apiRequest("/auth/reset-password", { method: "POST", data });
  },
};

/* Products Services */
export const productsApi = {
  async getProducts(params: Record<string, string | number> = {}) {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    return apiRequest(`/products${query ? `?${query}` : ""}`);
  },

  async getProduct(slug: string) {
    return apiRequest(`/products/${slug}`);
  },

  async addReview(
    productId: string,
    data: { rating: number; title: string; comment: string; customerName?: string },
  ) {
    return apiRequest(`/products/${productId}/reviews`, { method: "POST", data });
  },
};

/* Cart Services */
export const cartApi = {
  async getCart() {
    return apiRequest("/cart");
  },

  async addToCart(productId: string, size: string, color: string, quantity = 1) {
    return apiRequest("/cart/items", {
      method: "POST",
      data: { productId, size, color, quantity },
    });
  },

  async updateItem(productId: string, size: string, color: string, quantity: number) {
    return apiRequest("/cart/items", {
      method: "PATCH",
      data: { productId, size, color, quantity },
    });
  },

  async removeItem(productId: string, size: string, color: string) {
    return apiRequest("/cart/items", { method: "DELETE", data: { productId, size, color } });
  },

  async syncGuestCart() {
    return apiRequest("/cart/sync", { method: "POST" });
  },
};

/* Order Services */
export const ordersApi = {
  async createOrder(data: unknown) {
    return apiRequest("/orders", { method: "POST", data });
  },

  async getOrder(orderId: string) {
    return apiRequest(`/orders/${orderId}`);
  },

  async getMyOrders() {
    return apiRequest("/orders/me");
  },

  async cancelOrder(orderId: string) {
    return apiRequest(`/orders/${orderId}/cancel`, { method: "PATCH" });
  },
};

/* Admin Services */
export const adminApi = {
  async getOverview() {
    return apiRequest("/admin/dashboard");
  },

  async getOrders(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/orders${query ? `?${query}` : ""}`);
  },

  async updateOrderStatus(
    orderId: string,
    data: {
      fulfillmentStatus?: string | undefined;
      paymentStatus?: string | undefined;
      trackingNumber?: string | undefined;
    },
  ) {
    return apiRequest(`/admin/orders/${orderId}/status`, { method: "PATCH", data });
  },

  async getProducts() {
    return apiRequest("/admin/products");
  },

  async createProduct(data: unknown) {
    return apiRequest("/admin/products", { method: "POST", data });
  },

  async updateProduct(id: string, data: unknown) {
    return apiRequest(`/admin/products/${id}`, { method: "PATCH", data });
  },

  async deleteProduct(id: string) {
    return apiRequest(`/admin/products/${id}`, { method: "DELETE" });
  },

  async getCustomers() {
    return apiRequest("/admin/customers");
  },

  async getCoupons() {
    return apiRequest("/admin/coupons");
  },

  async createCoupon(data: unknown) {
    return apiRequest("/admin/coupons", { method: "POST", data });
  },

  async deleteCoupon(id: string) {
    return apiRequest(`/admin/coupons/${id}`, { method: "DELETE" });
  },
};
