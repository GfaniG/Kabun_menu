import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import {
  Category,
  MenuItem,
  SiteSettings,
  AdminUser,
  DiningTable,
  CustomerOrder,
  OrderItemInput,
  ServiceRequest,
  CashierSummary,
} from '../types/menu';
import { INITIAL_CATEGORIES } from '../data/initialMenu';

export const MENU_QUERY_KEYS = {
  menu: ['menu'] as const,
  items: (search?: string, categoryId?: string) => ['items', { search, categoryId }] as const,
  categories: (type?: string) => ['categories', { type }] as const,
  settings: ['settings'] as const,
  serviceRequests: ['service-requests'] as const,
};

const getLiveMenuCache = (): Category[] | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const saved = localStorage.getItem('kabun_live_menu_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return undefined;
};

// 1. Fetch full menu for customer QR view (Instant Live Sync, Zero Flash)
export function useMenu() {
  return useQuery<Category[]>({
    queryKey: MENU_QUERY_KEYS.menu,
    queryFn: async () => {
      try {
        const res = await api.getMenu();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          try {
            localStorage.setItem('kabun_live_menu_cache', JSON.stringify(res.data));
          } catch {}
          return res.data;
        }
        return INITIAL_CATEGORIES;
      } catch {
        const cached = getLiveMenuCache();
        return cached || INITIAL_CATEGORIES;
      }
    },
    placeholderData: (prev) => prev || getLiveMenuCache() || INITIAL_CATEGORIES,
    staleTime: 0,
    refetchInterval: 3000, // Poll every 3 seconds for instant real-time menu updates
    refetchOnWindowFocus: true,
  });
}

// 2. Fetch categories with optional type filter ("FOOD" | "DRINKS")
export function useCategories(type?: string) {
  return useQuery<Category[]>({
    queryKey: MENU_QUERY_KEYS.categories(type),
    queryFn: async () => {
      const res = await api.getCategories(type);
      return res.data;
    },
    staleTime: 0,
    refetchInterval: 3000,
  });
}

// 3. Fetch flat items list for admin
export function useItems(search?: string, categoryId?: string) {
  return useQuery<MenuItem[]>({
    queryKey: MENU_QUERY_KEYS.items(search, categoryId),
    queryFn: async () => {
      const res = await api.getItems(search, categoryId);
      return res.data;
    },
    staleTime: 0,
    refetchInterval: 3000,
  });
}

// 4. Instant toggle dish availability (Optimistic update)
export function useToggleItemStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable?: boolean }) =>
      api.toggleItemStatus(id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// 5. Create dish
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData | Record<string, any>) => api.createItem(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// 6. Update dish
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | Record<string, any> }) =>
      api.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// 7. Delete dish
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// 8. Category mutations
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; parentCategory?: string; icon?: string; sortOrder?: number }) =>
      api.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string; parentCategory?: string; icon?: string; sortOrder?: number };
    }) => api.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
    },
  });
}

export function useReorderCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => api.reorderCategories(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menu });
    },
  });
}

// 9. Site Settings CMS Hooks
export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: MENU_QUERY_KEYS.settings,
    queryFn: async () => {
      const res = await api.getSettings();
      return res.data;
    },
    staleTime: 0,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) => api.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.settings });
    },
  });
}

export function useResetSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.resetSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.settings });
    },
  });
}

// 10. Admin Account Credentials Hook
export function useUpdateAdminProfile() {
  return useMutation({
    mutationFn: (data: { username?: string; email?: string; name?: string; currentPassword?: string; newPassword?: string }) =>
      api.updateProfile(data),
    onSuccess: (res) => {
      if (res.admin) {
        sessionStorage.setItem('kabun_admin_user', JSON.stringify(res.admin));
      }
      if (res.token) {
        sessionStorage.setItem('kabun_admin_token', res.token);
      }
    },
  });
}

// 11. Menu Analytics Hook
export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const res = await api.getAnalyticsSummary();
      return res.data;
    },
    refetchInterval: 15000,
  });
}

// 12. Tables Hooks
export function useTables() {
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const res = await api.getTables();
      return res.data;
    },
    refetchInterval: 5000,
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { tableNumber: string; label?: string; capacity?: number; sortOrder?: number }) =>
      api.createTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DiningTable> }) =>
      api.updateTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

// 13. Orders Hooks (Live 3-second polling for Cashier desktop)
export function useOrders(status?: string) {
  return useQuery({
    queryKey: ['orders', { status }],
    queryFn: async () => {
      const res = await api.getOrders(status);
      return res.data;
    },
    refetchInterval: 3000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { tableNumber: string; items: OrderItemInput[]; customerNotes?: string }) =>
      api.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cashier-summary'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cashier-summary'] });
    },
  });
}

export function useTableOrders(tableNumber: string | null) {
  return useQuery({
    queryKey: ['table-orders', tableNumber],
    queryFn: async () => {
      if (!tableNumber) return [];
      const res = await api.getTableOrders(tableNumber);
      return res.data;
    },
    enabled: !!tableNumber,
    refetchInterval: 5000,
  });
}

// 14. Service Requests / Waiter Call Hooks (Live 3-second polling)
export function useServiceRequests(status?: string) {
  return useQuery({
    queryKey: ['service-requests', { status }],
    queryFn: async () => {
      const res = await api.getServiceRequests(status);
      return res.data;
    },
    refetchInterval: 3000,
  });
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      tableNumber: string;
      type: 'CALL_WAITER' | 'REQUEST_BILL' | 'WATER_REFILL' | string;
      paymentMethod?: string;
      notes?: string;
    }) => api.createServiceRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['cashier-summary'] });
    },
  });
}

export function useUpdateServiceRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateServiceRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['cashier-summary'] });
    },
  });
}

export function useCashierSummary() {
  return useQuery({
    queryKey: ['cashier-summary'],
    queryFn: async () => {
      const res = await api.getCashierSummary();
      return res.data;
    },
    refetchInterval: 3000,
  });
}
