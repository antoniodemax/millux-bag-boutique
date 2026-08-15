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
    <header className="fixed top-0 inset-x-0 z-50 h-[88px] bg-[#F8F6F2] border-b border-[#ECE7E0]">
      <div className="h-full px-6 md:px-12 flex items-center justify-between relative">
        {/* Left Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {leftLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-xs uppercase tracking-[0.2em] text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logo - Mobile: Left-aligned, Desktop: Centered */}
        <div className="flex-1 md:flex md:items-center md:justify-center">
          <Link
            to="/"
            className="block md:hidden"
          >
            <motion.img
              src="/images/millux.png"
              alt="Millux Collections"
              className="h-[24px] w-auto"
            />
          </Link>

          {/* Desktop logo - centered */}
          <motion.img
            src="/images/millux.png"
            alt="Millux Collections"
            className="hidden md:block w-[220px] max-w-none scale-[2.8] object-contain"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#1F1F1F]"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Right Navigation - Desktop only */}
        <div className="hidden md:flex items-center gap-7">
          {rightLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-xs uppercase tracking-[0.2em] text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}

          <button
            aria-label="Search"
            className="text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>

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