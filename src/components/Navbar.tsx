
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Logo clicked, navigating to homepage");
    navigate("/");
  };

  const handleWhatsAppContact = () => {
    const message = "Hi! I'm interested in your products at MilluxCollections.";
    const whatsappUrl = `https://wa.me/254723425778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-brand-light shadow-lg sticky top-0 z-50 border-b border-brand-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center">
            <div 
              onClick={handleLogoClick}
              className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/1d2236a3-cd00-401f-a3ac-6eecf0583bd1.png" 
                alt="Millux Collection Logo" 
                className="h-12 w-auto sm:h-16"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
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
            
            {user && (
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 text-brand-dark/70 hover:text-brand-primary" />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            )}
            
            <Button 
              onClick={handleWhatsAppContact}
              className="ml-2 lg:ml-4 bg-green-600 hover:bg-green-700 text-xs lg:text-sm px-3 lg:px-4 py-2"
            >
              <MessageCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Order on WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="h-5 w-5 text-brand-dark/70 hover:text-brand-primary" />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-primary hover:text-brand-dark hover:bg-brand-accent/20"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
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
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md ${
                    isActive(item.path)
                      ? "text-brand-primary bg-brand-accent/20"
                      : "text-brand-dark/70 hover:text-brand-primary hover:bg-brand-accent/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
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
      </div>
    </nav>
  );
};

export default Navbar;
