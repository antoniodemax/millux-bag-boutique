import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Collections', path: '/shop' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'About', path: '/about' },
    { label: 'Stockists', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[88px] bg-transparent">
      <div className="h-full px-6 md:px-12 flex items-start justify-between relative">
        {/* Logo - Mobile: Left-aligned, Desktop: Left-aligned */}
        <div className="flex-shrink-0 flex flex-col items-start self-start mt-2 ml-2">
          <Link
            to="/"
            className="block md:hidden"
          >
            <motion.img
              src="/images/milluxlogo.png"
              alt="Millux Collections"
              className="h-[24px] w-auto"
            />
          </Link>

          {/* Desktop logo - left-aligned */}
          <Link
            to="/"
            className="hidden md:block"
          >
            <motion.img
              src="/images/milluxlogo.png"
              alt="Millux Collections"
              className="h-[48px] w-auto"
            />
          </Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-baseline space-x-4 self-center">
          {/* Mobile menu button - shown on mobile, hidden on desktop */}
          <div className="md:hidden">
            <button
              className="text-[#FAF8F5]/90 hover:text-[#B68D40] transition-colors duration-200"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Desktop navigation group - shown on desktop, hidden on mobile */}
          <div className="hidden md:flex items-baseline space-x-4">
            {/* Navigation links: Collections, New Arrivals, About, Stockists */}
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`font-medium text-base uppercase tracking-[0.05em] text-[#FAF8F5]/90 ${isActive ? "border-b-2 border-[#B68D40]/50 pb-1" : ""} hover:text-[#B68D40] transition-colors duration-200`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Search icon */}
            <button
              aria-label="Search"
              className="text-[#FAF8F5]/90 hover:text-[#B68D40] transition-colors duration-200"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Shopping cart icon */}
            <button
              aria-label="Shopping Bag"
              className="relative text-[#FAF8F5]/90 hover:text-[#B68D40] transition-colors duration-300"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center bg-[#B68D40] text-[9px] font-medium text-white">
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
            {[...navItems].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-base font-medium uppercase tracking-[0.05em] text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-200`}>
                {item.label}
              </Link>
            ))}

            {/* Search Section */}
            <div className="border-t border-[#ECE7E0] pt-4 mt-4">
              <label htmlFor="mobile-search" className="block text-xs uppercase tracking-[0.05em] text-[#1F1F1F]/80 mb-2">
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