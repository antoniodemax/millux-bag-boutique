import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const leftLinks = [
  { label: 'Collections', path: '/shop' },
  { label: 'New Arrivals', path: '/shop' },
  { label: 'Bespoke', path: '/contact' },
];

const rightLinks = [
  { label: 'About', path: '/about' },
  { label: 'Stockists', path: '/contact' },
];

const PremiumNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-[88px] transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur border-b border-[#EAE5DF]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="h-full px-6 md:px-12 flex items-center justify-between relative">
        {/* Left links */}
        <nav className="hidden md:flex items-center gap-8">
          {leftLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-xs uppercase tracking-widest text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#1F1F1F]"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Center brand mark */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center overflow-hidden w-[220px] h-full"
        >
        {/* <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
        > */}
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src="/MILLUX COLLECTIONS LOGO.png"
            alt="Millux Collections"
            className="w-[270px] max-w-none scale-[2.8] object-contain"
          />
        </Link>

        {/* Right links + icons */}
        <div className="hidden md:flex items-center gap-7">
          {rightLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-xs uppercase tracking-widest text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
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
            aria-label="Bag"
            className="relative text-[#1F1F1F]/80 hover:text-[#B68D40] transition-colors duration-300"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-[#B68D40] text-white text-[9px] font-medium">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-[#EAE5DF] px-6 py-6 flex flex-col gap-5"
        >
          {[...leftLinks, ...rightLinks].map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-[#1F1F1F]/80"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
};

export default PremiumNavbar;