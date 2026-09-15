import apiClient from '@/lib/api/client';
import { Order, OrderItemWithProduct } from '@/types/models';

export type { Order };

export type OrderStatus = Order['status'];

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

/** Order detail: always includes items with product data */
export interface OrderDetail extends Order {
  items: OrderItemWithProduct[];
}

export interface OrderFilters {
  status?: OrderStatus | '';
  startDate?: Date | null;
  endDate?: Date | null;
}

/**
 * Get orders with optional filtering (admin)
 */
export const getOrders = async (filters?: OrderFilters): Promise<Order[]> => {
  const params = new URLSearchParams();
  if (filters?.status) {
    params.append('status', filters.status);
  }
  if (filters?.startDate) {
    params.append('startDate', filters.startDate.toISOString());
  }
  if (filters?.endDate) {
    params.append('endDate', filters.endDate.toISOString());
  }

  const queryString = params.toString();
  const url = `/api/orders${queryString ? `?${queryString}` : ''}`;
  const response = await apiClient.get(url);
  return response.data;
};

/**
 * Get order by ID with items (admin)
 */
export const getOrderById = async (id: string): Promise<OrderDetail> => {
  const response = await apiClient.get(`/api/orders/${id}`);
  return response.data;
};

/**
 * Update order status (admin)
 */
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  const response = await apiClient.patch(`/api/orders/${id}/status`, { status });
  return response.data;
};

/**
 * Create an order from cart items (customer)
 */
export const createOrderFromCart = async (
  cartItems: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    images: string[];
    category: string;
  }[],
  whatsappMessage?: string
): Promise<Order> => {
  const items = cartItems.map(item => ({
    productId: item.id,
    quantity: item.quantity
  }));

  const response = await apiClient.post('/api/orders', {
    items,
    whatsappMessage
  });

  return response.data;
};
