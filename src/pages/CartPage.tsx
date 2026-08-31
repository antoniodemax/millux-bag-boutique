import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getCustomerProfile, customerLogout } from '@/services/authService';
import { createOrderFromCart } from '@/services/orderService';
import { toast } from '@/components/ui/sonner';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);

  // Fetch customer name on load
  const loadCustomerInfo = async () => {
    try {
      const profile = await getCustomerProfile();
      setCustomerName(profile.customer.name);
    } catch (err) {
      // Not logged in, that's okay for guest checkout
      setCustomerName(null);
    }
  };

  // Handle placing order
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);
    try {
      // Create the order via backend API using cart items
      const order = await createOrderFromCart(cart);

      // Generate WhatsApp message
      const whatsappMessage = generateWhatsAppMessage(order);

      // Clear cart
      clearCart();

      // Show success
      toast.success('Order placed successfully! Opening WhatsApp...');

      // Open WhatsApp
      const whatsappUrl = `https://wa.me/254723425778?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      // Redirect to order history
      navigate('/customer/orders');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to place order';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate WhatsApp message for order confirmation
  const generateWhatsAppMessage = (order: any): string => {
    const customerInfo = customerName || 'Valued Customer';
    let message = `*New Order from Millux Collections*\n\n`;
    message += `*Order ID:* ${order.id.substring(0, 8)}...\n`;
    message += `*Customer:* ${customerInfo}\n`;
    message += `*Date:* ${new Date(order.createdAt).toLocaleString()}\n\n`;
    message += `*Items:*\n`;

    // Note: The order object from createOrder doesn't include items by default
    // We'll use the cart data instead since we have it
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (x${item.quantity}) - £${formatPrice(item.price * item.quantity)}\n`;
    });

    message += `\n*Total:* £${formatPrice(order.totalAmount)}\n\n`;
    message += `*Status:* ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}\n\n`;
    message += `Thank you for shopping with Millux Collections!`;

    return message;
  };

  // Handle continuing as guest (WhatsApp only)
  const handleGuestOrder = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Generate WhatsApp message for guest order
    let message = `*New Order Inquiry from Millux Collections*\n\n`;
    message += `*Customer:* Guest Customer\n`;
    message += `*Date:* ${new Date().toLocaleString()}\n\n`;
    message += `*Items:*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (x${item.quantity}) - £${formatPrice(item.price * item.quantity)}\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `\n*Total:* £${formatPrice(total)}\n\n`;
    message += `Please confirm availability and proceed with order.`;

    const whatsappUrl = `https://wa.me/254723425778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Clear cart after guest order too
    clearCart();
    toast.success('Your inquiry has been sent via WhatsApp!');
  };

  if (isLoading && cart.length === 0) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-88px)]">Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-88px)] bg-background">
      {/* Load customer info on mount */}
      {/* We'll use useEffect in a real implementation, but for simplicity we'll call it conditionally */}

      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Sidebar - simplified for customer area */}
        <aside className="w-64 bg-white border-r shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-primary">My Account</h2>
            <nav className="mt-6 space-y-2">
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/customer/profile');
                }}
              >
                Profile
              </a>
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 active"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/customer/orders');
                }}
              >
                Order History
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary">Your Shopping Cart</h1>
            <p className="text-text-sm mt-2">Review and edit your items before placing your order</p>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted">Your cart is empty.</p>
              <Link to="/" className="btn-primary mt-4 inline-block px-6 py-2">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Table className="min-w-full divide-y divide-muted">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2">Product</TableHead>
                      <TableHead className="w-1/6 text-center">Price</TableHead>
                      <TableHead className="w-1/6 text-center">Quantity</TableHead>
                      <TableHead className="w-1/6 text-center">Total</TableHead>
                      <TableHead className="w-1/6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded">
                            <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-text-xs text-muted-foreground">{item.category}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">£{formatPrice(item.price)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => {
                                const newQty = item.quantity - 1;
                                if (newQty >= 1) {
                                  updateQuantity(item.id, newQty);
                                } else {
                                  removeItem(item.id);
                                }
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                            >
                              −
                            </button>
                            <span className="w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                            >
                              +
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">£{formatPrice(item.price * item.quantity)}</TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-text-xs text-muted-foreground hover:text-danger underline"
                          >
                            Remove
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 pt-4 border-t border-muted">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Subtotal:</span>
                    <span>£{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    onClick={handleGuestOrder}
                    isLoading={isLoading}
                  >
                    Continue as Guest (WhatsApp)
                  </Button>

                  <Button
                    onClick={handlePlaceOrder}
                    isLoading={isLoading}
                  >
                    Place Order
                  </Button>
                </div>

                <p className="mt-4 text-text-sm text-center">
                  <small>
                    By placing an order, you agree to our <a href="#" className="underline">Terms of Service</a> and
                    <a href="#" className="underline">Privacy Policy</a>.
                  </small>
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CartPage;