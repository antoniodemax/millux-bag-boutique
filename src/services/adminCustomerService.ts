import apiClient from '@/lib/api/client';

export interface AdminCustomer {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
}

export interface AdminCustomerOrder {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  itemCount: number;
}

export interface AdminCustomerDetail extends AdminCustomer {
  orders: AdminCustomerOrder[];
}

export const listCustomers = async (): Promise<AdminCustomer[]> => {
  const response = await apiClient.get('/api/customers');
  return response.data;
};

export const getCustomer = async (id: string): Promise<AdminCustomerDetail> => {
  const response = await apiClient.get(`/api/customers/${id}`);
  return response.data;
};
