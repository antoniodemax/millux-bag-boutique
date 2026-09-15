import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getDashboardStats,
  getSalesOverview,
  getInventoryHealth,
  getRecentOrders,
  getAnalytics,
  DashboardStats,
  SalesOverviewPoint,
  InventoryHealth as InventoryHealthData,
  RecentOrder,
  BestSeller,
} from '@/services/dashboardService';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { InventoryHealth } from '@/components/dashboard/InventoryHealth';
import {
  PageHeader,
  Panel,
  StatTile,
  StatSkeleton,
  StatusPill,
  EmptyState,
  ErrorState,
  TableSkeleton,
  formatMoney,
  formatDate,
  shortId,
} from '@/components/admin/ui';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesOverview, setSalesOverview] = useState<SalesOverviewPoint[]>([]);
  const [inventoryHealth, setInventoryHealth] = useState<InventoryHealthData | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, salesData, inventoryData, ordersData, analyticsData] = await Promise.all([
        getDashboardStats(),
        getSalesOverview(),
        getInventoryHealth(),
        getRecentOrders(),
        getAnalytics(),
      ]);
      setStats(statsData);
      setSalesOverview(salesData);
      setInventoryHealth(inventoryData);
      setRecentOrders(ordersData);
      setBestSellers(analyticsData.bestSellers.slice(0, 5));
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err?.response?.data?.error?.message || err?.response?.data?.error || err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of sales, orders and stock across Millux Collections." />

      {error && !loading ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {loading || !stats ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                <StatTile
                  label="Total revenue"
                  value={formatMoney(stats.totalRevenue)}
                  caption={`${formatMoney(stats.todaySales)} today`}
                />
                <StatTile
                  label="Total orders"
                  value={stats.totalOrders}
                  caption={`${stats.todayItems} item${stats.todayItems === 1 ? '' : 's'} sold today`}
                />
                <StatTile
                  label="Open orders"
                  value={stats.openOrders}
                  caption="Pending or processing"
                />
                <StatTile
                  label="Products"
                  value={stats.productCount}
                  caption={stats.lowStock > 0 ? `${stats.lowStock} low on stock` : 'Stock levels healthy'}
                />
              </>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Panel title="Sales" description="Last 7 days" className="lg:col-span-2">
              {loading ? <TableSkeleton rows={4} cols={1} /> : <SalesChart data={salesOverview} />}
            </Panel>
            <Panel title="Inventory health" description="Products by stock status">
              {loading ? <TableSkeleton rows={4} cols={1} /> : <InventoryHealth data={inventoryHealth} />}
            </Panel>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Panel
              title="Recent orders"
              className="lg:col-span-2"
              action={
                <Link to="/admin/orders" className="text-xs uppercase tracking-[0.12em] text-[#B68D40] hover:underline">
                  View all
                </Link>
              }
            >
              {loading ? (
                <TableSkeleton rows={5} cols={5} />
              ) : recentOrders.length === 0 ? (
                <EmptyState title="No orders yet" description="Orders placed by customers will appear here." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#ECE7E0]">
                      <TableHead className="text-[#999999]">Order</TableHead>
                      <TableHead className="text-[#999999]">Customer</TableHead>
                      <TableHead className="text-[#999999] text-right">Items</TableHead>
                      <TableHead className="text-[#999999] text-right">Total</TableHead>
                      <TableHead className="text-[#999999]">Status</TableHead>
                      <TableHead className="text-[#999999]">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="border-[#ECE7E0]">
                        <TableCell>
                          <Link to="/admin/orders" className="font-mono text-xs text-[#1F1F1F] hover:text-[#B68D40]">
                            #{shortId(order.id)}
                          </Link>
                        </TableCell>
                        <TableCell className="text-[#1F1F1F]">{order.customerName || 'Guest'}</TableCell>
                        <TableCell className="text-right text-[#6B6B6B]">{order.itemCount}</TableCell>
                        <TableCell className="text-right text-[#1F1F1F]">{formatMoney(order.totalAmount)}</TableCell>
                        <TableCell><StatusPill status={order.status} /></TableCell>
                        <TableCell className="text-[#6B6B6B] whitespace-nowrap">{formatDate(order.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Panel>

            <Panel title="Top products" description="Best sellers, all time">
              {loading ? (
                <TableSkeleton rows={5} cols={2} />
              ) : bestSellers.length === 0 ? (
                <EmptyState title="No sales yet" description="Best sellers appear once orders are placed." />
              ) : (
                <ul className="divide-y divide-[#ECE7E0]">
                  {bestSellers.map((p, i) => (
                    <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="font-playfair text-sm text-[#999999] w-4">{i + 1}</span>
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover bg-[#F3F0EB]" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-[#F3F0EB]" />
                      )}
                      <div className="flex-1 min-w-0">
                        <Link to={`/admin/products/${p.slug}/edit`} className="block text-sm text-[#1F1F1F] truncate hover:text-[#B68D40]">
                          {p.name}
                        </Link>
                        <p className="text-xs text-[#999999] !leading-normal md:!text-xs">{p.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#1F1F1F] !leading-normal md:!text-sm">{p.unitsSold} sold</p>
                        <p className="text-xs text-[#999999] !leading-normal md:!text-xs">{formatMoney(p.revenue)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
