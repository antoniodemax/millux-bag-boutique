import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const leftLinks = [
  { label: 'Collections', path: '/shop' },
  { label: 'New Arrivals', path: '/shop' },
];

const rightLinks = [
  { label: 'About', path: '/about' },
  { label: 'Stockists', path: '/contact' },
];

const PremiumNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[88px] bg-transparent">
      <div className="h-full px-6 md:px-12 flex items-center justify-between relative">
        {/* Logo - Left aligned for both mobile and desktop */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="block"
          >
            <motion.img
              src="/images/millux.png"
              alt="Millux Collections"
              className="h-[24px] w-auto"
            />
          </Link>
        </div>

        {/* Center spacer for mobile - pushes menu button to right */}
        <div className="hidden md:block flex-1">
          {/* This space is hidden on mobile, shown on desktop to create proper spacing */}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu button - shown on mobile, hidden on desktop */}
          <div className="md:hidden">
            <button
              className="text-[#1F1F1F] hover:text-[#B68D40] transition-colors duration-200"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Desktop navigation - shown on desktop, hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation links: leftLinks + rightLinks */}
            {[...leftLinks, ...rightLinks].map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-xs uppercase tracking-[0.2em] text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}

            {/* Search icon */}
            <button
              aria-label="Search"
              className="text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Shopping cart icon */}
            <button
              aria-label="Shopping Bag"
              className="relative text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center bg-[#B68D40] text-[9px] font-medium text-white">
                2
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="md:hidden bg-[#F8F6F2] border-b border-[#ECE7E0] px-6 py-6 flex flex-col gap-5"
        >
          {/* Navigation Links */}
          {[...leftLinks, ...rightLinks].map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}

          {/* Search Section */}
          <div className="border-t border-[#ECE7E0] pt-4 mt-4">
            <label htmlFor="mobile-search" className="block text-xs uppercase tracking-[0.2em] text-[#1F1F1F]/80 mb-2">
              Search
            </label>
            <input
              id="mobile-search"
              type="text"
              placeholder="Search collections..."
              className="w-full px-4 py-2 border border-[#EAE5DF] rounded-md text-sm focus:outline-none focus:border-[#B68D40]"
            />
          </div>

          {/* Shopping Bag Section */}
          <div className="border-t border-[#ECE7E0] pt-4 mt-4 flex items-center">
            <button
              aria-label="Shopping Bag"
              className="relative flex-1 text-center text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1/2 -translate-x-1/2 flex h-4 w-4 items-center justify-center bg-[#B68D40] text-[9px] font-medium text-white">
                2
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default PremiumNavbar;