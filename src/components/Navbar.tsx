import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, MessageCircle, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, cartCount, cartTotal, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    // initial call in case page loads scrolled
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Collections", path: "/shop" },
    { name: "New Arrivals", path: "/new-arrivals" },
  ];

  const utilityItems = [
    { name: "About", path: "/about" },
    { name: "Stockists", path: "/#" },
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
    <>
      {/* Fixed Navbar */}
      <nav className={`fixed inset-x-0 top-0 z-50 h-16 sm:h-20 transition-colors duration-200 ${scrolled ? "bg-brand-light/90 backdrop-blur-sm border-b border-brand-accent/20 shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-full sm:h-20 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center flex-shrink-0">
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

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Primary Navigation (Center) */}
            <div className="flex-1 flex items-center justify-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? scrolled
                        ? "text-brand-primary"
                        : "text-brand-light"
                      : scrolled
                        ? "text-brand-dark/70 hover:text-brand-primary"
                        : "text-brand-light/70 hover:text-brand-light"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Utility Navigation (Right) */}
            <div className="flex items-center space-x-4">
              {utilityItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? scrolled
                        ? "text-brand-primary"
                        : "text-brand-light"
                      : scrolled
                        ? "text-brand-dark/70 hover:text-brand-primary"
                        : "text-brand-light/70 hover:text-brand-light"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className={`pl-10 pr-4 py-2 text-sm font-medium border border-brand-accent/20 rounded-md focus:border-brand-accent/50 focus:outline-none w-24 md:w-32 ${scrolled ? "text-brand-dark" : "text-brand-light"} placeholder-${scrolled ? "text-brand-dark/60" : "text-brand-light/60"}`}
                />
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${scrolled ? "text-brand-dark/50" : "text-brand-light/50"}`} />
              </div>
              {/* Cart */}
              <button
                onClick={() => setCartDrawerOpen(!cartDrawerOpen)}
                className={`relative ml-4 flex items-center px-2 py-2 rounded-md border border-brand-accent/30 ${scrolled ? "text-brand-dark/70 hover:text-brand-primary hover:bg-brand-accent/10" : "text-brand-light/70 hover:text-brand-light hover:bg-brand-accent/20"} transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20`}
                aria-label="View cart"
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

          {/* Mobile Icons (hidden on desktop) */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Search Icon */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className={`pl-8 pr-4 py-2 text-sm font-medium border border-brand-accent/20 rounded-md focus:border-brand-accent/50 focus:outline-none ${scrolled ? "text-brand-dark" : "text-brand-light"} placeholder-${scrolled ? "text-brand-dark/60" : "text-brand-light/60"}`}
              />
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${scrolled ? "text-brand-dark/50" : "text-brand-light/50"}`} />
            </div>
            {/* Cart Icon */}
            <button
              onClick={() => setCartDrawerOpen(!cartDrawerOpen)}
              className={`relative p-1 rounded hover:bg-brand-accent/10 ${scrolled ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20" : "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"}`}
              aria-label="View cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center bg-brand-primary text-[9px] font-medium text-white rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1 rounded hover:bg-brand-accent/10 ${scrolled ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20" : "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"}`}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-light/90 backdrop-blur-sm border-t border-brand-accent/20">
            {/* Primary Navigation */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-4 text-base font-medium transition-colors duration-200 rounded-md ${
                  isActive(item.path)
                    ? "text-brand-primary bg-brand-accent/20"
                    : "text-brand-dark/70 hover:text-brand-primary hover:bg-brand-accent/10 focus:text-brand-primary focus:bg-brand-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Utility Navigation */}
            {utilityItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md text-brand-dark/70 hover:text-brand-primary hover:bg-brand-accent/10`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
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

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-lg">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <input
                id="mobile-search"
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 text-sm font-medium border border-brand-accent/20 rounded-md focus:border-brand-accent/50 focus:outline-none block w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-dark/50" />
            </div>
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
                          className="w-8 h-8 flex items-center justify-center rounded border border-brand-accent/30 hover:bg-brand-accent/10 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"
                        >
                          <span className="text-[9px]">−</span>
                        </button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded border border-brand-accent/30 hover:bg-brand-accent/10 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"
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
    </>
  );
};

export default Navbar;