import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { getCustomerOrders } from '@/services/authService';
import { toast } from '@/components/ui/sonner';
import { formatPrice } from '@/lib/utils';
import { EmptyState, Skeleton } from '@/components/store/Primitives';
import { cn } from '@/lib/utils';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface CustomerOrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  product: { name: string; slug: string; images: string[]; category: string };
}

interface CustomerOrder {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: CustomerOrderItem[];
}

const FALLBACK_IMAGE = '/images/handbags-category.png';

const statusClass = (status: OrderStatus) =>
  cn(
    'brand-label inline-flex items-center px-2.5 py-1',
    status === 'delivered' && 'bg-success-tint text-success',
    status === 'cancelled' && 'bg-danger-tint text-danger',
    status !== 'delivered' && status !== 'cancelled' && 'bg-stone text-soft'
  );

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const CustomerOrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCustomerOrders()
      .then((data) => { if (active) setOrders(data as CustomerOrder[]); })
      .catch((err: unknown) => {
        if (!active) return;
        toast.error(isAxiosError(err) && typeof err.response?.data?.error === 'string' ? err.response.data.error : 'Please sign in to view your orders');
        navigate('/customer/login');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading your orders">
        {[0, 1].map((i) => (
          <div key={i} className="border border-line p-6">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-6 h-14 w-full" />
            <Skeleton className="mt-3 h-14 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        message="Once you place an order it will appear here with its status."
        action={{ to: '/shop', label: 'Shop the collection' }}
        className="py-10"
      />
    );
  }

  return (
    <ul className="space-y-6" aria-label="Your orders">
      {orders.map((order) => (
        <li key={order.id} className="border border-line">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <p className="font-sans text-sm text-ink">Order #{order.id.substring(0, 8).toUpperCase()}</p>
              <p className="mt-0.5 text-xs text-faint">{formatDate(order.createdAt)}</p>
            </div>
            <span className={statusClass(order.status)}>{order.status}</span>
          </div>

          <ul className="divide-y divide-line px-5 sm:px-6">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden bg-stone">
                  <img src={item.product?.images?.[0] || FALLBACK_IMAGE} alt={item.product?.name ?? 'Product'} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${item.product?.slug ?? ''}`} className="font-display text-base leading-snug text-ink hover:text-gold-deep transition-colors focus-ring">
                    {item.product?.name ?? 'Product'}
                  </Link>
                  <p className="mt-0.5 text-xs text-soft">
                    {item.quantity} × {formatPrice(item.priceAtPurchase)}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-ink">{formatPrice(item.quantity * item.priceAtPurchase)}</p>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-line bg-stone px-5 py-4 sm:px-6">
            <span className="brand-label text-soft">Total</span>
            <span className="font-sans text-base text-ink">{formatPrice(order.totalAmount)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CustomerOrderHistory;
