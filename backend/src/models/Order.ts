export interface Order {
  id: string;
  customerId: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  whatsappMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItemWithProduct[]; // Populated when fetched with items
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  createdAt: Date;
}

export interface OrderItemWithProduct extends OrderItem {
  product: Product;
}

// Import Product type to avoid circular dependency issues
// We'll define a lightweight product interface here for the OrderItemWithProduct
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  materials: string;
  dimensions: string;
  care: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
  createdAt: Date;
  updatedAt: Date;
}