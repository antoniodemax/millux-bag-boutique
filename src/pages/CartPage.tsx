import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatKES } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { getCustomerProfile } from '@/services/authService';
import { createOrderFromCart } from '@/services/orderService';
import { toast } from '@/components/ui/sonner';
import { StoreButton } from '@/components/store/Button';
import { Container, EmptyState, PageHeading } from '@/components/store/Primitives';
import type { Order } from '@/types/models';

const WHATSAPP_NUMBER = '254723425778';
const FALLBACK_IMAGE = '/images/handbags-category.png';

const errorMessage = (err: unknown, fallback: string) =>
  isAxiosError(err) && typeof err.response?.data?.error === 'string' ? err.response.data.error : fallback;

const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart, cartTotal, cartCount } = useCart();
  const { isConverted } = useCurrency();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);

  // Guests can still send a WhatsApp inquiry, so a failed profile load is not an error
  useEffect(() => {
    let active = true;
    getCustomerProfile()
      .then((profile) => { if (active) setCustomerName(profile?.name ?? null); })
      .catch(() => { if (active) setCustomerName(null); });
    return () => { active = false; };
  }, []);

  const itemLines = () =>
    cart.map((item, index) => `${index + 1}. ${item.name} (x${item.quantity}) - ${formatKES(item.price * item.quantity)}`).join('\n');

  const generateWhatsAppMessage = (order: Order): string => {
    let message = `*New Order from Millux Collections*\n\n`;
    message += `*Order ID:* ${order.id.substring(0, 8)}...\n`;
    message += `*Customer:* ${customerName || 'Valued Customer'}\n`;
    message += `*Date:* ${new Date(order.createdAt ?? Date.now()).toLocaleString()}\n\n`;
    message += `*Items:*\n${itemLines()}\n`;
    message += `\n*Total:* ${formatKES(order.totalAmount)}\n\n`;
    message += `*Status:* ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}\n\n`;
    message += `Thank you for shopping with Millux Collections!`;
    return message;
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your bag is empty');
      return;
    }
    setIsLoading(true);
    try {
      const order = await createOrderFromCart(cart);
      const whatsappMessage = generateWhatsAppMessage(order);
      clearCart();
      toast.success('Order placed. Opening WhatsApp…');
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      navigate('/customer/orders');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        toast.info('Please sign in to place an order, or send your bag as a WhatsApp inquiry.');
        navigate('/customer/login', { state: { from: { pathname: '/cart' } } });
        return;
      }
      toast.error(errorMessage(err, 'Failed to place order'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestOrder = () => {
    if (cart.length === 0) {
      toast.error('Your bag is empty');
      return;
    }
    let message = `*New Order Inquiry from Millux Collections*\n\n`;
    message += `*Customer:* ${customerName || 'Guest Customer'}\n`;
    message += `*Date:* ${new Date().toLocaleString()}\n\n`;
    message += `*Items:*\n${itemLines()}\n`;
    message += `\n*Total:* ${formatKES(cartTotal)}\n\n`;
    message += `Please confirm availability and proceed with order.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    clearCart();
    toast.success('Your inquiry has been sent via WhatsApp');
  };

  return (
    <Container className="pb-20">
      <PageHeading eyebrow="Your selection" title="Shopping bag" />

      {cart.length === 0 ? (
        <EmptyState
          title="Your bag is empty"
          message="Pieces you add will appear here."
          action={{ to: '/shop', label: 'Shop the collection' }}
          className="pt-4"
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Items */}
          <ul className="divide-y divide-line border-y border-line" aria-label="Items in your bag">
            {cart.map((item) => {
              const lineTotal = item.price * item.quantity;
              return (
                <li key={item.id} className="flex gap-4 py-6 sm:gap-6">
                  <Link to={`/products/${item.slug}`} className="block w-20 shrink-0 sm:w-24 focus-ring">
                    <div className="aspect-[4/5] overflow-hidden bg-stone">
                      <img src={item.images?.[0] || FALLBACK_IMAGE} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="brand-label text-faint">{item.category}</p>
                        <h2 className="mt-1 font-display text-lg leading-snug text-ink">
                          <Link to={`/products/${item.slug}`} className="focus-ring hover:text-gold-deep transition-colors">
                            {item.name}
                          </Link>
                        </h2>
                        <p className="mt-1 text-sm text-soft">{formatPrice(item.price)}</p>
                      </div>
                      <p className="shrink-0 font-sans text-sm text-ink sm:text-base">{formatPrice(lineTotal)}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center border border-line" role="group" aria-label={`Quantity for ${item.name}`}>
                        <button
                          type="button"
                          onClick={() => (item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id))}
                          aria-label={item.quantity > 1 ? `Decrease quantity of ${item.name}` : `Remove ${item.name}`}
                          className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-stone focus-ring"
                        >
                          <Minus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        </button>
                        <span className="w-10 text-center font-sans text-sm tabular-nums text-ink" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-stone focus-ring"
                        >
                          <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        </button>
                      </div>
                      <StoreButton variant="tertiary" size="sm" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name} from bag`}>
                        Remove
                      </StoreButton>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Order summary">
            <div className="bg-stone p-6 sm:p-8">
              <h2 className="font-display text-xl text-ink">Summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-soft">
                  <dt>{cartCount} item{cartCount === 1 ? '' : 's'}</dt>
                  <dd>{formatPrice(cartTotal)}</dd>
                </div>
                <div className="flex justify-between border-t border-line-strong pt-3 text-base text-ink">
                  <dt className="font-medium">Subtotal</dt>
                  <dd className="font-medium">{formatPrice(cartTotal)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-soft">
                Delivery and payment are arranged over WhatsApp after you place your order.{isConverted && ` You will be charged in Kenyan shillings (${formatKES(cartTotal)}); US dollar amounts are approximate.`}
              </p>

              <div className="mt-8 space-y-3">
                <StoreButton full size="lg" onClick={handlePlaceOrder} loading={isLoading}>
                  {customerName ? 'Place order' : 'Sign in to place order'}
                </StoreButton>
                <StoreButton full variant="secondary" onClick={handleGuestOrder} disabled={isLoading}>
                  Send as WhatsApp inquiry
                </StoreButton>
              </div>
              <div className="mt-6 text-center">
                <Link to="/shop" className="brand-link">Continue shopping</Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
};

export default CartPage;
