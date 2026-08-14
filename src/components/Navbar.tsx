import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, MessageCircle, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, cartCount, cartTotal, updateQuantity, removeItem } = useCart();

  const navItems = [
    { name: "Collections", path: "/shop" },
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "Bespoke", path: "/#" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleWhatsAppContact = () => {
    const message = "Hi! I'm interested in your products at MilluxCollections.";
    const whatsappUrl = `https://wa.me/254723425778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCartWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = "Hi! I'd like to order the following items from Millux Collections:\n\n";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: £${item.price * item.quantity}\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `Total: £${total}\n\n`;
    message += "Please confirm availability and proceed with order.";

    const whatsappUrl = `https://wa.me/254723425778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <nav className="bg-brand-light shadow-lg sticky top-0 z-50 border-b border-brand-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand Logo (Mobile) */}
          <div className="flex items-center">
            <div
              onClick={() => navigate("/")}
              className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="font-playfair text-xl lg:text-2xl font-bold text-brand-primary">
                MILLUX
              </span>
              <span className="font-playfair text-xs lg:text-sm font-light text-brand-primary ml-1">
                COLLECTIONS
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {/* Left Nav */}
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-2 lg:px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-brand-primary border-b-2 border-brand-primary"
                      : "text-brand-dark/70 hover:text-brand-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Center Logo (Desktop) */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-playfair text-xl lg:text-2xl font-bold text-brand-primary">
                  MILLUX
                </span>
                <span className="font-playfair text-xs lg:text-sm font-light text-brand-primary ml-1">
                  COLLECTIONS
                </span>
              </div>
            </div>

            {/* Right Nav */}
            <div className="flex items-center space-x-4">
              <Link
                to="/about"
                className="px-2 lg:px-3 py-2 text-sm font-medium transition-colors duration-200 text-brand-dark/70 hover:text-brand-primary"
              >
                About
              </Link>
              <Link
                to="/#"
                className="px-2 lg:px-3 py-2 text-sm font-medium transition-colors duration-200 text-brand-dark/70 hover:text-brand-primary"
              >
                Stockists
              </Link>
              {/* Search */}
              <div className="relative">
                <Search className="h-4 w-4 text-brand-dark/50" />
                <input
                  type="text"
                  placeholder="Search"
                  className="ml-2 px-3 py-2 text-sm font-medium border border-brand-accent/20 rounded-md focus:border-brand-accent/50 focus:outline-none w-24 md:w-32"
                />
              </div>
              {/* Cart */}
              <button
                onClick={() => setCartDrawerOpen(!cartDrawerOpen)}
                className="relative px-2 lg:px-3 py-2 text-sm font-medium transition-colors duration-200 text-brand-dark/70 hover:text-brand-primary"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center bg-brand-primary text-[9px] font-medium text-white rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-primary hover:text-brand-dark hover:bg-brand-accent/20"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-light border-t border-brand-accent/20">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-4 text-base font-medium transition-colors duration-200 rounded-md ${
                  isActive(item.path)
                    ? "text-brand-primary bg-brand-accent/20"
                    : "text-brand-dark/70 hover:text-brand-primary hover:bg-brand-accent/10"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md text-brand-dark/70 hover:text-brand-primary hover:bg-brand-accent/10"
            >
              About
            </Link>
            <Link
              to="/#"
              className="block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md text-brand-dark/70 hover:text-brand-primary hover:bg-brand-accent/10"
            >
              Stockists
            </Link>
            <div className="flex items-center px-3 py-2 text-base font-medium transition-colors duration-200">
              <Search className="h-4 w-4 mr-2 text-brand-dark/50" />
              <input
                type="text"
                placeholder="Search"
                className="flex-1 px-3 py-2 text-sm font-medium border border-brand-accent/20 rounded-md focus:border-brand-accent/50 focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                handleWhatsAppContact();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-green-600 hover:text-green-700 hover:bg-brand-accent/10 rounded-md"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Order on WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-white p-6 space-y-6">
            <div className="space-y-4">
              <p className="font-playfair text-xl text-primary mb-2">
                Your Cart
              </p>
              {cartCount === 0 ? (
                <p className="text-text-muted">Your cart is empty.</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between pb-2 border-b border-brand-accent/20">
                      <div className="flex-1">
                        <p className="font-playfair text-lg text-primary">{item.name}</p>
                        <p className="text-text-muted">{item.quantity}x £{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            const newQty = item.quantity - 1;
                            if (newQty >= 1) {
                              updateQuantity(item.id, newQty);
                            } else {
                              removeItem(item.id);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded border border-brand-accent/30 hover:bg-brand-accent/10 transition-colors duration-200"
                        >
                          <span className="text-[9px]">−</span>
                        </button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded border border-brand-accent/30 hover:bg-brand-accent/10 transition-colors duration-200"
                        >
                          <span className="text-[9px]">+</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-brand-accent/20">
                    <p className="flex justify-between">
                      <span className="font-playfair text-lg text-primary">Subtotal:</span>
                      <span className="font-playfair text-lg text-accent">£{formatPrice(cartTotal)}</span>
                    </p>
                  </div>
                </>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="px-4 py-2 border border-brand-accent/30 text-brand-primary hover:text-brand-dark/80 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={handleCartWhatsAppOrder}
                  className="ml-4 px-6 py-3 bg-brand-accent text-white text-sm font-medium rounded-lg hover:bg-brand-accent/90 transition-colors duration-200"
                >
                  Order via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;