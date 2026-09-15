import apiClient from '@/lib/api/client';

export interface DashboardStats {
  todaySales: number;
  todayItems: number;
  lowStock: number;
  openOrders: number;
  openRegisters: number;
  totalRevenue: number;
  totalOrders: number;
  productCount: number;
}

export interface SalesOverviewPoint {
  day: string;
  total: number;
}

export interface InventoryHealth {
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface RecentOrder {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
  itemCount: number;
}

export interface BestSeller {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string | null;
  unitsSold: number;
  revenue: number;
}

export interface LowStockProduct {
  id: string;
  slug: string;
  name: string;
  stock: number;
}

export interface Analytics {
  period: { days: number | null; since: string | null };
  revenue: number;
  orderCount: number;
  activeOrderCount: number;
  averageOrderValue: number;
  unitsSold: number;
  customerCount: number;
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  bestSellers: BestSeller[];
  inventory: {
    productCount: number;
    unitsInStock: number;
    stockValue: number;
    lowStock: LowStockProduct[];
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/api/dashboard/stats');
  return response.data;
};

export const getSalesOverview = async (): Promise<SalesOverviewPoint[]> => {
  const response = await apiClient.get('/api/dashboard/sales-overview');
  return response.data;
};

export const getInventoryHealth = async (): Promise<InventoryHealth> => {
  const response = await apiClient.get('/api/dashboard/inventory-health');
  return response.data;
};

export const getRecentOrders = async (): Promise<RecentOrder[]> => {
  const response = await apiClient.get('/api/dashboard/recent-orders');
  return response.data;
};

/**
 * @param days - Number of days to include; omit for all time
 */
export const getAnalytics = async (days?: number): Promise<Analytics> => {
  const response = await apiClient.get('/api/dashboard/analytics', {
    params: days ? { days } : undefined,
  });
  return response.data;
};
