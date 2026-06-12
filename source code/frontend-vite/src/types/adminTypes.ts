import type { Order } from "./orderTypes";
import type { Product } from "./productTypes";

export interface DashboardMetrics {
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalCategories: number;
  totalReviews: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ProductSales {
  productId: number;
  productName: string;
  totalSold: number;
  thumbnailImage?: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentOrders: Order[];
  recentCustomers: { id: number; fullName: string; email: string; mobile?: string; createdAt?: string }[];
  lowStockProducts: Product[];
  topSellingProducts: ProductSales[];
  revenueByMonth: ChartDataPoint[];
  ordersByMonth: ChartDataPoint[];
  productSalesDistribution: ChartDataPoint[];
  customerGrowth: ChartDataPoint[];
}

export interface CustomerProfile {
  id: number;
  fullName: string;
  email: string;
  mobile?: string;
  registrationDate?: string;
  accountStatus: string;
  totalOrders: number;
  totalSpend: number;
  orderHistory: Order[];
}

export interface StoreSettings {
  id?: number;
  storeName: string;
  storeLogo?: string;
  contactNumber?: string;
  supportEmail?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  razorpayEnabled: boolean;
  stripeEnabled: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpEnabled: boolean;
}

export interface AdminNotification {
  id: number;
  message: string;
  type: string;
  sentAt: string;
  readStatus: boolean;
}
