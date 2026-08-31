import apiClient from '@/lib/api/client';
import { Order, OrderItem } from '@/types/models';

/**
 * Get orders with optional filtering
 * @param filters - Optional filters (status, customerId, startDate, endDate)
 * @returns Promise resolving to array of orders
 */
export const getOrders = async (
  filters?: {
    status?: string;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<Order[]> => {
  // Build query params
  const params = new URLSearchParams();
  if (filters?.status) {
    params.append('status', filters.status);
  }
  if (filters?.customerId) {
    params.append('customerId', filters.customerId);
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
 * Get order by ID
 * @param id - Order ID
 * @returns Promise resolving to order
 */
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await apiClient.get(`/api/orders/${id}`);
  return response.data;
};

/**
 * Update order status
 * @param id - Order ID
 * @param status - New status
 * @returns Promise resolving to updated order
 */
export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  const response = await apiClient.patch(`/api/orders/${id}/status`, { status });
  return response.data;
};

/**
 * Create an order from cart items
 * @param cartItems - Array of cart items to order
 * @param whatsappMessage - Optional WhatsApp message
 * @returns Promise resolving to created order
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
  // Transform cart items to order items format
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