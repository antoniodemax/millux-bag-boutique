import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/services/dashboardService';
import { getSalesOverview } from '@/services/dashboardService';
import { getPaymentMix } from '@/services/dashboardService';
import { getInventoryHealth } from '@/services/dashboardService';
import { StatCard } from '@/components/dashboard/StatCard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { PaymentMix } from '@/components/dashboard/PaymentMix';
import { InventoryHealth } from '@/components/dashboard/InventoryHealth';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<{
    todaySales: number;
    todayItems: number;
    lowStock: number;
    openRegisters: number;
  } | null>(null);
  const [salesOverview, setSalesOverview] = useState<Array<{ day: string; total: number }>>([]);
  const [paymentMix, setPaymentMix] = useState<Array<{ method: string; amount: number; count: number }>>([]);
  const [inventoryHealth, setInventoryHealth] = useState<{ inStock: number; lowStock: number; outOfStock: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, salesData, paymentData, inventoryData] = await Promise.all([
          getDashboardStats(),
          getSalesOverview(),
          getPaymentMix(),
          getInventoryHealth(),
        ]);
        setStats(statsData);
        setSalesOverview(salesData);
        setPaymentMix(paymentData);
        setInventoryHealth(inventoryData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        // In a real app, we might show an error toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-background">
        <div className="flex items-center justify-center min-h-[calc(100vh-88px)]">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-88px)] bg-background">
      {/* Header */}
      <div className="px-6 py-4 bg-background/50 backdrop-blur-sm border-b border-border/20">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
          <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
          <p className="text-text-muted">Store performance and inventory overview.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats && (
            <>
              <StatCard label="Today's Sales" value={`£${stats.todaySales.toFixed(2)}`} trend="▲ 12% vs yesterday" icon="TrendingUp" color="green" />
              <StatCard label="Items Sold Today" value={stats.todayItems} trend="▲ 8% vs yesterday" icon="ShoppingCart" color="green" />
              <StatCard label="Low Stock Items" value={stats.lowStock} trend={stats.lowStock > 0 ? '▲ 5' : '▲ 0'} icon="PackageMinus" color={stats.lowStock > 0 ? 'orange' : 'green'} />
              <StatCard label="Open Registers" value={stats.openRegisters} trend="■ Active" icon="Store" color="green" />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-4">
          {/* Sales Chart - takes full width on md, 2/4 on lg */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <SalesChart data={salesOverview} />
          </div>

          {/* Payment Mix and Inventory Health - each 1/2 on md, 1/4 on lg */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <PaymentMix data={paymentMix} />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <InventoryHealth data={inventoryHealth} />
          </div>
        </div>
      </div>
    </div>
  );
};