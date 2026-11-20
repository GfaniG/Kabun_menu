export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  categoryId: string;
  category?: Category;
  image?: string | null;
  isAvailable: boolean;
  tags?: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentCategory: 'FOOD' | 'DRINKS' | string;
  icon?: string | null;
  sortOrder: number;
  items?: MenuItem[];
  _count?: {
    items: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  id: string;
  restaurantName: string;
  tagline: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  primaryCtaText: string;
  secondaryCtaText: string;

  wifiSsid: string;
  wifiPassword: string;

  philosophyEyebrow: string;
  philosophyTitle: string;
  philosophyDescription: string;
  manifestoQuote: string;
  manifestoAuthor: string;

  galleryTitle: string;
  galleryDescription: string;

  addressLine1: string;
  addressLine2: string;
  openingHours: string;
  phone1: string;
  phone2: string;
  instagramHandle: string;
  instagramUrl: string;
  tiktokHandle: string;
  tiktokUrl: string;
  facebookHandle: string;
  facebookUrl: string;

  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  fontFamily: string;
  defaultTheme?: string;

  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  username?: string | null;
  email: string;
  name: string;
}

export interface DiningTable {
  id: string;
  tableNumber: string;
  label?: string | null;
  capacity: number;
  isActive: boolean;
  sortOrder: number;
  orders?: Array<{
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItemInput {
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId?: string | null;
  name: string;
  price: number;
  quantity: number;
  notes?: string | null;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  status: 'PENDING' | 'PREPARING' | 'SERVED' | 'COMPLETED' | 'CANCELLED' | string;
  totalAmount: number;
  customerNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  table?: {
    label?: string;
    capacity?: number;
  };
}

export interface ServiceRequest {
  id: string;
  tableNumber: string;
  type: 'CALL_WAITER' | 'REQUEST_BILL' | 'WATER_REFILL' | string;
  paymentMethod?: string | null;
  notes?: string | null;
  status: 'PENDING' | 'COMPLETED' | 'DISMISSED' | string;
  createdAt: string;
  updatedAt?: string;
}

export interface CashierSummary {
  pendingOrdersCount: number;
  pendingRequestsCount: number;
  totalPendingAlerts: number;
  latestOrder?: {
    id: string;
    orderNumber: string;
    tableNumber: string;
    createdAt: string;
  } | null;
  latestRequest?: {
    id: string;
    tableNumber: string;
    type: string;
    createdAt: string;
  } | null;
  serverTime: string;
}
