// Data models for the application
export interface User {
  uid: string;
  email: string;
  name?: string;
  role?: 'admin' | 'user';
  createdAt?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number; // in pounds
  images: string[]; // Image URLs or paths
  description: string;
  materials: string;
  dimensions: string;
  care: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  image?: string; // Image URL or path
  available: boolean;
  orderNumber?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string; // For WhatsApp
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number; // Store price at time of order
}

export interface Order {
  id: string;
  customerId: string; // Reference to Customer
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  whatsappMessage?: string; // The message sent to WhatsApp for reference
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  change: number; // Positive for addition, negative for removal
  reason: string; // e.g., 'order', 'restock', 'damage'
  referenceId?: string; // e.g., orderId
  timestamp?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category?: string;
  date?: string; // ISO date string
  createdAt?: string;
}

export interface WhatsAppInquiry {
  id: string;
  name?: string;
  phoneNumber?: string; // The customer's number
  message: string;
  timestamp?: string;
  read?: boolean;
  answered?: boolean;
}