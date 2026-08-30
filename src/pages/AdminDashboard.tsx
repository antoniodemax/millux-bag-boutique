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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-88px)] bg-background">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
          <p className="text-text-muted text-sm">Overview of your store's performance and operations.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-0">
        {/* Stats Cards */}
        <div className="grid gap-4 mb-6">
          <div className="sm:grid-cols-2 lg:grid-cols-4">
            {stats && (
              <>
                <StatCard label="Today's Sales" value={`£${stats.todaySales.toFixed(2)}`} trend="▲ 12% vs yesterday" icon="TrendingUp" color="green" />
                <StatCard label="Items Sold Today" value={stats.todayItems} trend="▲ 8% vs yesterday" icon="ShoppingCart" color="green" />
                <StatCard label="Low Stock Items" value={stats.lowStock} trend={stats.lowStock > 0 ? '▲ 5' : '▲ 0'} icon="PackageMinus" color={stats.lowStock > 0 ? 'orange' : 'green'} />
                <StatCard label="Open Registers" value={stats.openRegisters} trend="■ Active" icon="Store" color="green" />
              </>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6">
          <div className="lg:col-span-8">
            <SalesChart data={salesOverview} className="h-96" />
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-6 mt-6 lg:mt-0">
            <div>
              <PaymentMix data={paymentMix} className="h-80" />
            </div>
            <div>
              <InventoryHealth data={inventoryHealth} className="h-80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};