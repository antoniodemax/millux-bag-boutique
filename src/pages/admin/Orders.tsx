import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { getOrders, getOrderById, updateOrderStatus, OrderDetail, OrderStatus, ORDER_STATUSES } from '@/services/orderService';
import { Order } from '@/types/models';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { formatMoney, formatDate, formatDateTime } from '@/lib/format';
import {
  PageHeader, Panel, OutlineButton, OrderStatusPill, LoadingRows, ErrorState, EmptyState, Thumb, errorMessage, inputClass,
} from '@/components/admin/AdminUi';

const ALL = '__all__';

const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const toStartOfDay = (value: string): Date | null => {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};
const toEndOfDay = (value: string): Date | null => {
  if (!value) return null;
  const d = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(d.getTime()) ? null : d;
};

const CustomerCell = ({ order }: { order: Order }) => {
  if (!order.customer) return <span className="text-[#8C887F]">Guest</span>;
  return (
    <div className="min-w-0">
      <p className="text-[#0A0A0A] truncate">{order.customer.name || 'Unnamed customer'}</p>
      {order.customer.email && <p className="text-xs text-[#8C887F] truncate">{order.customer.email}</p>}
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders({
        status: statusFilter === ALL ? '' : (statusFilter as OrderStatus),
        startDate: toStartOfDay(startDate),
        endDate: toEndOfDay(endDate),
      });
      setOrders(data);
    } catch (err) {
      setError(errorMessage(err, 'Failed to load orders'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, startDate, endDate]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((o) =>
      o.id.toLowerCase().includes(term) ||
      (o.customer?.name ?? '').toLowerCase().includes(term) ||
      (o.customer?.email ?? '').toLowerCase().includes(term)
    );
  }, [orders, search]);

  const openDetail = async (id: string) => {
    setDialogOpen(true);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      setDetail(await getOrderById(id));
    } catch (err) {
      setDetailError(errorMessage(err, 'Failed to load order details'));
    } finally {
      setDetailLoading(false);
    }
  };

  const changeStatus = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: updated.status, updatedAt: updated.updatedAt } : o)));
      setDetail((prev) => (prev && prev.id === id ? { ...prev, status: updated.status, updatedAt: updated.updatedAt } : prev));
      toast.success(`Order marked as ${statusLabel(updated.status)}`);
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to update status'));
    } finally {
      setUpdatingId(null);
    }
  };

  const StatusSelect = ({ order, size = 'sm' }: { order: Pick<Order, 'id' | 'status'>; size?: 'sm' | 'md' }) => (
    <Select
      value={order.status}
      onValueChange={(v) => changeStatus(order.id, v as OrderStatus)}
      disabled={updatingId === order.id}
    >
      <SelectTrigger className={`${inputClass} ${size === 'sm' ? 'h-8 w-36 text-xs' : 'w-44'}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const hasFilters = statusFilter !== ALL || startDate || endDate;

  return (
    <div>
      <PageHeader title="Orders" description="Review orders, customers and fulfilment status." />

      <Panel>
        <div className="grid gap-3 p-4 border-b border-[#E4E0D7] md:grid-cols-[1fr_auto_auto_auto] md:items-end">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-[#5B5852]">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C887F]" />
              <Input
                placeholder="Order id, customer name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-9 ${inputClass}`}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-[#5B5852]">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={`w-full md:w-40 ${inputClass}`}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-[#5B5852]">From</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`md:w-40 ${inputClass}`} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-[#5B5852]">To</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`md:w-40 ${inputClass}`} />
          </div>
        </div>

        {loading ? (
          <LoadingRows rows={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : orders.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No orders match these filters' : 'No orders yet'}
            description={hasFilters ? 'Adjust the status or date range.' : 'Orders placed through the store will appear here.'}
            action={hasFilters ? (
              <OutlineButton onClick={() => { setStatusFilter(ALL); setStartDate(''); setEndDate(''); }}>Clear filters</OutlineButton>
            ) : undefined}
          />
        ) : filtered.length === 0 ? (
          <EmptyState title="No matches" description="Try a different search term." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-[#E4E0D7]">
                  <TableHead className="text-[#5B5852]">Order</TableHead>
                  <TableHead className="text-[#5B5852]">Date</TableHead>
                  <TableHead className="text-[#5B5852]">Customer</TableHead>
                  <TableHead className="text-[#5B5852] text-right">Items</TableHead>
                  <TableHead className="text-[#5B5852] text-right">Total</TableHead>
                  <TableHead className="text-[#5B5852]">Status</TableHead>
                  <TableHead className="text-[#5B5852] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow key={order.id} className="border-[#E4E0D7] hover:bg-[#F5F2EC]">
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => openDetail(order.id)}
                        className="font-mono text-xs text-[#0A0A0A] hover:text-[#A27627] transition-colors"
                        title={order.id}
                      >
                        #{order.id.slice(0, 8)}
                      </button>
                    </TableCell>
                    <TableCell className="text-[#5B5852] whitespace-nowrap">{formatDate(order.createdAt)}</TableCell>
                    <TableCell><CustomerCell order={order} /></TableCell>
                    <TableCell className="text-right tabular-nums text-[#0A0A0A]">{order.itemCount ?? order.items?.length ?? 0}</TableCell>
                    <TableCell className="text-right tabular-nums text-[#0A0A0A]">{formatMoney(order.totalAmount)}</TableCell>
                    <TableCell><OrderStatusPill status={order.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <StatusSelect order={order} />
                        <OutlineButton size="sm" onClick={() => openDetail(order.id)}>View</OutlineButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Panel>

      {/* Order detail dialog (controlled) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-[#E4E0D7] w-[92vw] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {detail ? `Order #${detail.id.slice(0, 8)}` : 'Order details'}
            </DialogTitle>
            <DialogDescription>
              {detail ? `Placed ${formatDateTime(detail.createdAt)}` : 'Loading order information'}
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full bg-[#F5F2EC]" />)}
            </div>
          ) : detailError ? (
            <ErrorState message={detailError} />
          ) : detail ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-[#5B5852]">Customer</p>
                  {detail.customer ? (
                    <div className="text-sm">
                      <p className="text-[#0A0A0A] font-medium">{detail.customer.name || 'Unnamed customer'}</p>
                      {detail.customer.email && <p className="text-[#5B5852]">{detail.customer.email}</p>}
                      {detail.customer.phone && <p className="text-[#5B5852]">{detail.customer.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-[#8C887F]">Guest order</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-[#5B5852]">Status</p>
                  <div className="flex items-center gap-3">
                    <StatusSelect order={detail} size="md" />
                    <OrderStatusPill status={detail.status} />
                  </div>
                  <p className="text-xs text-[#8C887F]">Full id: <span className="font-mono">{detail.id}</span></p>
                </div>
              </div>

              {detail.whatsappMessage && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-[#5B5852]">WhatsApp message</p>
                  <p className="text-sm text-[#0A0A0A] whitespace-pre-wrap bg-[#F5F2EC] border border-[#E4E0D7] rounded-md p-3">
                    {detail.whatsappMessage}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-[#5B5852]">Items</p>
                {detail.items.length === 0 ? (
                  <p className="text-sm text-[#8C887F]">This order has no line items.</p>
                ) : (
                  <div className="border border-[#E4E0D7] rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-[#E4E0D7]">
                          <TableHead className="text-[#5B5852]">Product</TableHead>
                          <TableHead className="text-[#5B5852] text-right">Qty</TableHead>
                          <TableHead className="text-[#5B5852] text-right">Price</TableHead>
                          <TableHead className="text-[#5B5852] text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detail.items.map((item) => (
                          <TableRow key={item.id} className="border-[#E4E0D7]">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Thumb src={item.product?.images?.[0]} alt={item.product?.name ?? 'Product'} size="h-10 w-10" />
                                <div className="min-w-0">
                                  <p className="text-sm text-[#0A0A0A] truncate">{item.product?.name ?? 'Product unavailable'}</p>
                                  {item.product?.category && <p className="text-xs text-[#8C887F]">{item.product.category}</p>}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatMoney(item.priceAtPurchase)}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatMoney(item.priceAtPurchase * item.quantity)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="hover:bg-transparent border-[#E4E0D7] bg-[#F5F2EC]">
                          <TableCell colSpan={3} className="text-right text-sm text-[#5B5852]">Order total</TableCell>
                          <TableCell className="text-right font-sans font-semibold tabular-nums text-lg text-[#0A0A0A]">{formatMoney(detail.totalAmount)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
