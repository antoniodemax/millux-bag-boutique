import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  listCustomers,
  getCustomer,
  AdminCustomer,
  AdminCustomerDetail,
} from '@/services/adminCustomerService';
import {
  PageHeader,
  Panel,
  StatTile,
  StatSkeleton,
  StatusPill,
  EmptyState,
  ErrorState,
  TableSkeleton,
  BackLink,
  formatMoney,
  formatDate,
  formatDateTime,
  shortId,
} from '@/components/admin/ui';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const errorMessage = (err: any, fallback: string) =>
  err?.response?.data?.error?.message || err?.response?.data?.error || err?.message || fallback;

/* ---------- List ---------- */

const CustomerList = () => {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCustomers(await listCustomers());
    } catch (err: any) {
      console.error('Failed to load customers:', err);
      setError(errorMessage(err, 'Failed to load customers'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [c.name, c.email, c.phone].some((v) => v && v.toLowerCase().includes(q))
    );
  }, [customers, search]);

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Registered customer accounts and their order history."
        actions={
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C887F]" />
            <Input
              placeholder="Search by name, email or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white border-[#E4E0D7]"
            />
          </div>
        }
      />

      {error && !loading ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <Panel bodyClassName="p-0">
          {loading ? (
            <div className="p-6"><TableSkeleton rows={6} cols={6} /></div>
          ) : customers.length === 0 ? (
            <EmptyState title="No customers yet" description="Accounts created through the storefront will appear here." />
          ) : filtered.length === 0 ? (
            <EmptyState title="No matches" description="Try a different search term." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#E4E0D7]">
                  <TableHead className="text-[#8C887F] pl-6">Customer</TableHead>
                  <TableHead className="text-[#8C887F]">Phone</TableHead>
                  <TableHead className="text-[#8C887F] text-right">Orders</TableHead>
                  <TableHead className="text-[#8C887F] text-right">Total spent</TableHead>
                  <TableHead className="text-[#8C887F]">Last order</TableHead>
                  <TableHead className="text-[#8C887F] pr-6">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="border-[#E4E0D7]">
                    <TableCell className="pl-6">
                      <Link to={`/admin/customers/${c.id}`} className="block group">
                        <span className="block text-[#0A0A0A] group-hover:text-[#A27627]">{c.name || 'Unnamed'}</span>
                        <span className="block text-xs text-[#8C887F]">{c.email || '—'}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-[#5B5852]">{c.phone || '—'}</TableCell>
                    <TableCell className="text-right text-[#0A0A0A]">{c.orderCount}</TableCell>
                    <TableCell className="text-right text-[#0A0A0A]">{formatMoney(c.totalSpent)}</TableCell>
                    <TableCell className="text-[#5B5852] whitespace-nowrap">{formatDate(c.lastOrderAt)}</TableCell>
                    <TableCell className="text-[#5B5852] whitespace-nowrap pr-6">{formatDate(c.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Panel>
      )}
    </div>
  );
};

/* ---------- Detail ---------- */

const CustomerDetail = ({ id }: { id: string }) => {
  const [customer, setCustomer] = useState<AdminCustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCustomer(await getCustomer(id));
    } catch (err: any) {
      console.error('Failed to load customer:', err);
      setError(err?.response?.status === 404 ? 'Customer not found.' : errorMessage(err, 'Failed to load customer'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <BackLink to="/admin/customers" label="All customers" />

      {loading ? (
        <>
          <PageHeader title="Customer" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatSkeleton /><StatSkeleton /><StatSkeleton />
          </div>
          <Panel title="Orders"><TableSkeleton rows={4} cols={5} /></Panel>
        </>
      ) : error || !customer ? (
        <ErrorState message={error ?? 'Customer not found.'} onRetry={fetchData} />
      ) : (
        <>
          <PageHeader
            title={customer.name || 'Unnamed customer'}
            description={`Customer since ${formatDate(customer.createdAt)}`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatTile label="Orders" value={customer.orderCount} />
            <StatTile label="Total spent" value={formatMoney(customer.totalSpent)} caption="Excluding cancelled orders" />
            <StatTile label="Last order" value={formatDate(customer.lastOrderAt)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Panel title="Profile">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8C887F]">Email</dt>
                  <dd className="text-[#0A0A0A] mt-1 break-all">{customer.email || '—'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8C887F]">Phone</dt>
                  <dd className="text-[#0A0A0A] mt-1">{customer.phone || '—'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8C887F]">Joined</dt>
                  <dd className="text-[#0A0A0A] mt-1">{formatDateTime(customer.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8C887F]">Customer ID</dt>
                  <dd className="font-mono text-xs text-[#5B5852] mt-1 break-all">{customer.id}</dd>
                </div>
              </dl>
            </Panel>

            <Panel
              title="Order history"
              className="lg:col-span-2"
              action={
                <Link to="/admin/orders" className="text-xs uppercase tracking-[0.12em] text-[#A27627] hover:underline">
                  All orders
                </Link>
              }
            >
              {customer.orders.length === 0 ? (
                <EmptyState title="No orders yet" description="This customer has not placed an order." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#E4E0D7]">
                      <TableHead className="text-[#8C887F]">Order</TableHead>
                      <TableHead className="text-[#8C887F]">Date</TableHead>
                      <TableHead className="text-[#8C887F] text-right">Items</TableHead>
                      <TableHead className="text-[#8C887F] text-right">Total</TableHead>
                      <TableHead className="text-[#8C887F]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.orders.map((o) => (
                      <TableRow key={o.id} className="border-[#E4E0D7]">
                        <TableCell>
                          <Link to="/admin/orders" className="font-mono text-xs text-[#0A0A0A] hover:text-[#A27627]">
                            #{shortId(o.id)}
                          </Link>
                        </TableCell>
                        <TableCell className="text-[#5B5852] whitespace-nowrap">{formatDateTime(o.createdAt)}</TableCell>
                        <TableCell className="text-right text-[#5B5852]">{o.itemCount}</TableCell>
                        <TableCell className="text-right text-[#0A0A0A]">{formatMoney(o.totalAmount)}</TableCell>
                        <TableCell><StatusPill status={o.status} /></TableCell>
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

const AdminCustomers = () => {
  const { id } = useParams<{ id?: string }>();
  return id ? <CustomerDetail id={id} /> : <CustomerList />;
};

export default AdminCustomers;
