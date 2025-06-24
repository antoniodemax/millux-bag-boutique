
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";

const CartContent = () => {
  const { cartItems, updateQuantity, removeFromCart, isLoading } = useCart();
  const { user } = useAuth();

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    updateQuantity({ itemId, quantity: newQuantity });
  };

  const removeItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  const shipping = 500; // Fixed shipping cost
  const total = subtotal + shipping;

  const handleWhatsAppCheckout = () => {
    const itemsText = cartItems.map(item => 
      `${item.products.name} x${item.quantity} - KSh ${(item.products.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    const message = `Hi! I'd like to place an order:\n\n${itemsText}\n\nSubtotal: KSh ${subtotal.toLocaleString()}\nShipping: KSh ${shipping.toLocaleString()}\nTotal: KSh ${total.toLocaleString()}`;
    
    const whatsappUrl = `https://wa.me/254723425778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8 sm:py-12">
            <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Add some beautiful bags to get started!</p>
            <Link to="/shop">
              <Button className="w-full sm:w-auto">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Product Image */}
                    <div className="bg-gray-200 h-16 w-16 sm:h-20 sm:w-20 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                      {item.products.image_url ? (
                        <img 
                          src={item.products.image_url} 
                          alt={item.products.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded"></div>
                      )}
                    </div>

                    {/* Product Details - Mobile Layout */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.products.name}</h3>
                      <p className="text-gray-600 text-sm sm:text-base">KSh {item.products.price.toLocaleString()}</p>
                    </div>

                    {/* Mobile Controls Section */}
                    <div className="flex flex-col space-y-3 sm:hidden">
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center h-8 text-sm"
                          min="0"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Total and Remove */}
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 text-sm">
                          KSh {(item.products.price * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 h-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Desktop Controls - Hidden on Mobile */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          min="0"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[100px]">
                        <p className="font-semibold text-gray-900">
                          KSh {(item.products.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary - Sticky on Desktop */}
          <div className="lg:self-start lg:sticky lg:top-8">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">KSh {shipping.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-sm sm:text-base">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">KSh {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full text-sm sm:text-base" onClick={handleWhatsAppCheckout}>
                    Checkout via WhatsApp
                  </Button>
                  <Link to="/shop">
                    <Button variant="outline" className="w-full text-sm sm:text-base">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <p>Free delivery in Nairobi for orders over KSh 5,000</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  return (
    <AuthGuard>
      <CartContent />
    </AuthGuard>
  );
};

export default Cart;
