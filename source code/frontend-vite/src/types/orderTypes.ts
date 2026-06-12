import type { Product } from "./productTypes";
import type { Address, User } from "./userTypes";

export interface OrderState {
  orders: Order[];
  orderItem: OrderItem | null;
  currentOrder: Order | null;
  paymentOrder: any | null;
  loading: boolean;
  error: string | null;
  orderCanceled: boolean;
}

export interface Order {
  id: number;
  orderId: string;
  user: User;
  orderItems: OrderItem[];
  orderDate: string;
  shippingAddress: Address;
  paymentDetails: any;
  paymentStatus?: string;
  totalMrpPrice: number;
  totalSellingPrice?: number;
  discount?: number;
  orderStatus: OrderStatus;
  totalItem: number;
  deliverDate: string;
  statusHistory?: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  id: number;
  status: string;
  note?: string;
  changedBy?: string;
  changedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "REFUNDED";

export interface OrderItem {
  id: number;
  order?: Order;
  product?: Product;
  productId?: number;
  productTitle?: string;
  personalizedGift?: { id: number; customMessage?: string; uploadedImage?: string };
  personalizedGiftId?: number;
  customMessage?: string;
  uploadedImage?: string;
  quantity: number;
  mrpPrice: number;
  sellingPrice: number;
  userId?: number;
}
