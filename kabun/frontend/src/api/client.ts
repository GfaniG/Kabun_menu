import {
  MenuItem,
  Category,
  AdminUser,
  SiteSettings,
  DiningTable,
  CustomerOrder,
  OrderItemInput,
  ServiceRequest,
  CashierSummary,
} from '../types/menu';
import { toFriendlyErrorMessage } from '../utils/friendlyErrors';

// In production, always use relative paths (same origin). In development, fallback to proxy or env.
const API_BASE = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || '');

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('kabun_admin_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Only set Content-Type to application/json if body is not FormData
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

    let res: Response;
    try {
      res = await fetch(url, {
        ...options,
        headers,
      });
    } catch {
      // In browsers, network loss or server cold starts throw "TypeError: Failed to fetch"
      throw new Error(
        "We're having trouble connecting to the roastery. Please check your internet connection or try again in a moment."
      );
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const rawError = data?.error || data?.message;
      const errorMsg = toFriendlyErrorMessage(
        rawError,
        res.status >= 500
          ? 'Our system is taking a brief moment to refresh. Please give it a few seconds and try again.'
          : res.status === 404
          ? 'The requested menu item, table, or service could not be found.'
          : res.status === 401 || res.status === 403
          ? 'Your session has ended. Please sign in again to continue.'
          : 'Something unexpected happened. Please give it another try.'
      );
      throw new Error(errorMsg);
    }

    return data;
  }

  // --- Auth ---
  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; token: string; admin: AdminUser }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: usernameOrEmail, email: usernameOrEmail, password }),
    });
  }

  async getMe(): Promise<{ success: boolean; admin: AdminUser }> {
    return this.request('/api/auth/me');
  }

  async updateProfile(data: {
    username?: string;
    email?: string;
    name?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message: string; token?: string; admin: AdminUser }> {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // --- Site Settings CMS ---
  async getSettings(): Promise<{ success: boolean; data: SiteSettings }> {
    return this.request('/api/settings');
  }

  async updateSettings(data: Partial<SiteSettings>): Promise<{ success: boolean; message: string; data: SiteSettings }> {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async resetSettings(): Promise<{ success: boolean; message: string; data: SiteSettings }> {
    return this.request('/api/settings/reset', {
      method: 'POST',
    });
  }

  // --- Menu & Items ---
  async getMenu(): Promise<{ success: boolean; data: Category[] }> {
    return this.request('/api/menu');
  }

  async getItems(search?: string, categoryId?: string): Promise<{ success: boolean; data: MenuItem[] }> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoryId && categoryId !== 'all') params.append('categoryId', categoryId);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/menu/items${queryString}`);
  }

  async createItem(formData: FormData | Record<string, any>): Promise<{ success: boolean; data: MenuItem }> {
    const isForm = formData instanceof FormData;
    return this.request('/api/menu/items', {
      method: 'POST',
      body: isForm ? formData : JSON.stringify(formData),
    });
  }

  async updateItem(id: string, formData: FormData | Record<string, any>): Promise<{ success: boolean; data: MenuItem }> {
    const isForm = formData instanceof FormData;
    return this.request(`/api/menu/items/${id}`, {
      method: 'PUT',
      body: isForm ? formData : JSON.stringify(formData),
    });
  }

  async deleteItem(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/menu/items/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleItemStatus(id: string, isAvailable?: boolean): Promise<{ success: boolean; data: MenuItem }> {
    return this.request(`/api/menu/items/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable }),
    });
  }

  // --- Categories ---
  async getCategories(type?: string): Promise<{ success: boolean; data: Category[] }> {
    const q = type ? `?type=${encodeURIComponent(type)}` : '';
    return this.request(`/api/categories${q}`);
  }

  async createCategory(data: {
    name: string;
    description?: string;
    parentCategory?: string;
    icon?: string;
    sortOrder?: number;
  }): Promise<{ success: boolean; data: Category }> {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      parentCategory?: string;
      icon?: string;
      sortOrder?: number;
    }
  ): Promise<{ success: boolean; data: Category }> {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderCategories(categoryIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.request('/api/categories/reorder', {
      method: 'PUT',
      body: JSON.stringify({ categoryIds }),
    });
  }



  // --- Tables ---
  async getTables(): Promise<{ success: boolean; data: DiningTable[] }> {
    return this.request('/api/tables');
  }

  async createTable(data: {
    tableNumber: string;
    label?: string;
    capacity?: number;
    sortOrder?: number;
  }): Promise<{ success: boolean; message: string; data: DiningTable }> {
    return this.request('/api/tables', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTable(
    id: string,
    data: Partial<DiningTable>
  ): Promise<{ success: boolean; message: string; data: DiningTable }> {
    return this.request(`/api/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTable(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/tables/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Orders ---
  async createOrder(data: {
    tableNumber: string;
    items: OrderItemInput[];
    customerNotes?: string;
  }): Promise<{ success: boolean; message: string; data: CustomerOrder }> {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrders(status?: string): Promise<{ success: boolean; data: CustomerOrder[] }> {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request(`/api/orders${q}`);
  }

  async updateOrderStatus(
    id: string,
    status: string
  ): Promise<{ success: boolean; message: string; data: CustomerOrder }> {
    return this.request(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getTableOrders(tableNumber: string): Promise<{ success: boolean; data: CustomerOrder[] }> {
    return this.request(`/api/orders/table/${encodeURIComponent(tableNumber)}`);
  }

  // --- Service Requests / Waiter Call ---
  async createServiceRequest(data: {
    tableNumber: string;
    type: 'CALL_WAITER' | 'REQUEST_BILL' | 'WATER_REFILL' | string;
    paymentMethod?: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; data: ServiceRequest }> {
    return this.request('/api/service-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getServiceRequests(status?: string): Promise<{ success: boolean; data: ServiceRequest[] }> {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request(`/api/service-requests${q}`);
  }

  async updateServiceRequestStatus(
    id: string,
    status: string
  ): Promise<{ success: boolean; message: string; data: ServiceRequest }> {
    return this.request(`/api/service-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getCashierSummary(): Promise<{ success: boolean; data: CashierSummary }> {
    return this.request('/api/cashier/summary');
  }

  // --- Menu Analytics ---
  async trackEvent(data: {
    type: 'PAGE_VIEW' | 'TABLE_SCAN' | 'ITEM_VIEW';
    tableNumber?: string;
    itemId?: string;
    itemName?: string;
  }): Promise<{ success: boolean }> {
    return this.request('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnalyticsSummary(): Promise<{
    success: boolean;
    data: {
      totalPageViews: number;
      totalTableScans: number;
      totalDishViews: number;
      topDishes: Array<{
        id: string;
        name: string;
        price: number | null;
        image: string | null;
        viewsCount: number;
        category?: { name: string; parentCategory: string };
      }>;
      topTables: Array<{ tableNumber: string; count: number }>;
    };
  }> {
    return this.request('/api/analytics/summary');
  }
}

export const api = new ApiClient();
