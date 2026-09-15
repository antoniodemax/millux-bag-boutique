import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics, Analytics as AnalyticsData } from '@/services/dashboardService';
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
} from '@/components/admin/ui';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const PERIODS: { label: string; days?: number }[] = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: 'All time' },
];

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

const AdminAnalytics = () => {
  const [periodIndex, setPeriodIndex] = useState(1);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const days = PERIODS[periodIndex].days;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getAnalytics(days));
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      setError(err?.response?.data?.error?.message || err?.response?.data?.error || err?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const periodSelector = (
    <div className="inline-flex rounded-md border border-[#ECE7E0] bg-white p-0.5">
      {PERIODS.map((p, i) => (
        <button
          key={p.label}
          type="button"
          onClick={() => setPeriodIndex(i)}
          className={cn(
            'px-3 py-1.5 text-xs uppercase tracking-[0.1em] rounded transition-colors',
            i === periodIndex ? 'bg-[#1F1F1F] text-[#FAF8F5]' : 'text-[#6B6B6B] hover:text-[#1F1F1F]'
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );

  const totalOrders = data?.orderCount ?? 0;

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Revenue, orders and stock computed from real order data. Cancelled orders are excluded from revenue."
        actions={periodSelector}
      />

      {error && !loading ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
            {loading || !data ? (
              Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
            ) : (
              <>
                <StatTile label="Revenue" value={formatMoney(data.revenue)} />
                <StatTile
                  label="Orders"
                  value={data.orderCount}
                  caption={`${data.activeOrderCount} active`}
                />
                <StatTile label="Units sold" value={data.unitsSold} />
                <StatTile label="Avg. order value" value={formatMoney(data.averageOrderValue)} />
                <StatTile label="Customers" value={data.customerCount} caption="Registered accounts" />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Panel title="Orders by status">
              {loading || !data ? (
                <TableSkeleton rows={5} cols={2} />
              ) : totalOrders === 0 ? (
                <EmptyState title="No orders in this period" />
              ) : (
                <ul className="space-y-3">
                  {STATUS_ORDER.map((status) => {
                    const count = data.ordersByStatus[status] ?? 0;
                    const pct = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                    return (
                      <li key={status}>
                        <div className="flex items-center justify-between mb-1.5">
                          <StatusPill status={status} />
                          <span className="font-playfair text-base text-[#1F1F1F]">{count}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#F3F0EB]">
                          <div className="h-1.5 rounded-full bg-[#B68D40]" style={{ width: `${pct}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>

            <Panel title="Best sellers" description="By units sold" className="lg:col-span-2">
              {loading || !data ? (
                <TableSkeleton rows={5} cols={4} />
              ) : data.bestSellers.length === 0 ? (
                <EmptyState title="No sales in this period" description="Best sellers appear once orders are placed." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#ECE7E0]">
                      <TableHead className="text-[#999999]">Product</TableHead>
                      <TableHead className="text-[#999999]">Category</TableHead>
                      <TableHead className="text-[#999999] text-right">Units</TableHead>
                      <TableHead className="text-[#999999] text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.bestSellers.map((p) => (
                      <TableRow key={p.id} className="border-[#ECE7E0]">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="h-9 w-9 rounded object-cover bg-[#F3F0EB]" />
                            ) : (
                              <div className="h-9 w-9 rounded bg-[#F3F0EB]" />
                            )}
                            <Link to={`/admin/products/${p.slug}/edit`} className="text-[#1F1F1F] hover:text-[#B68D40]">
                              {p.name}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#6B6B6B]">{p.category}</TableCell>
                        <TableCell className="text-right text-[#1F1F1F]">{p.unitsSold}</TableCell>
                        <TableCell className="text-right text-[#1F1F1F]">{formatMoney(p.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Panel>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Panel title="Inventory" description="Current stock, all products">
              {loading || !data ? (
                <TableSkeleton rows={3} cols={2} />
              ) : (
                <dl className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <dt className="text-sm text-[#6B6B6B]">Products</dt>
                    <dd className="font-playfair text-xl text-[#1F1F1F]">{data.inventory.productCount}</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-sm text-[#6B6B6B]">Units in stock</dt>
                    <dd className="font-playfair text-xl text-[#1F1F1F]">{data.inventory.unitsInStock.toLocaleString('en-GB')}</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-sm text-[#6B6B6B]">Stock value</dt>
                    <dd className="font-playfair text-xl text-[#1F1F1F]">{formatMoney(data.inventory.stockValue)}</dd>
                  </div>
                </dl>
              )}
            </Panel>

            <Panel
              title="Low stock"
              description="Products with 5 or fewer units"
              className="lg:col-span-2"
              action={
                <Link to="/admin/products" className="text-xs uppercase tracking-[0.12em] text-[#B68D40] hover:underline">
                  Manage products
                </Link>
              }
            >
              {loading || !data ? (
                <TableSkeleton rows={4} cols={2} />
              ) : data.inventory.lowStock.length === 0 ? (
                <EmptyState title="All products are well stocked" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#ECE7E0]">
                      <TableHead className="text-[#999999]">Product</TableHead>
                      <TableHead className="text-[#999999] text-right">Stock</TableHead>
                      <TableHead className="text-[#999999] text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.inventory.lowStock.map((p) => (
                      <TableRow key={p.id} className="border-[#ECE7E0]">
                        <TableCell>
                          <Link to={`/admin/products/${p.slug}/edit`} className="text-[#1F1F1F] hover:text-[#B68D40]">
                            {p.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-playfair text-base text-[#1F1F1F]">{p.stock}</TableCell>
                        <TableCell className="text-right">
                          <StatusPill status={p.stock === 0 ? 'out_of_stock' : 'low_stock'} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
