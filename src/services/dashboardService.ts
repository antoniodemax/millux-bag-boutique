import apiClient from '@/lib/api/client';

export interface DashboardStats {
  todaySales: number;
  todayItems: number;
  lowStock: number;
  openRegisters: number;
}

export interface SalesOverviewPoint {
  day: string;
  total: number;
}

export interface PaymentMethod {
  method: string;
  amount: number;
  count: number;
}

export interface InventoryHealth {
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

/**
 * Get dashboard statistics for KPI cards
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/api/dashboard/stats');
  return response.data;
};

/**
 * Get sales overview for the last 7 days
 */
export const getSalesOverview = async (): Promise<SalesOverviewPoint[]> => {
  const response = await apiClient.get('/api/dashboard/sales-overview');
  return response.data;
};

/**
 * Get payment mix (placeholder)
 */
export const getPaymentMix = async (): Promise<PaymentMethod[]> => {
  const response = await apiClient.get('/api/dashboard/payment-mix');
  return response.data;
};

/**
 * Get inventory health
 */
export const getInventoryHealth = async (): Promise<InventoryHealth> => {
  const response = await apiClient.get('/api/dashboard/inventory-health');
  return response.data;
};