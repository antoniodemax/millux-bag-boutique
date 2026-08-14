import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, MessageCircle, Search } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Collections", path: "/shop" },
    { name: "New Arrivals", path: "/shop" },
    { name: "Bespoke", path: "/shop" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleWhatsAppContact = () => {
    const message = "Hi! I'm interested in your products at MilluxCollections.";
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
              {/* Shopping Bag */}
              <Link
                to="/#"
                className="px-2 lg:px-3 py-2 text-sm font-medium transition-colors duration-200 text-brand-dark/70 hover:text-brand-primary"
              >
                Shopping Bag
              </Link>
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
    </nav>
  );
};

export default Navbar;