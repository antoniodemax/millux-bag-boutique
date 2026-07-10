import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Collections', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 h-[72px] transition-all duration-300 ${
        scrolled
          ? 'bg-white border-b border-gray-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container-wide h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold font-playfair"
            style={{ color: scrolled ? '#1F1F1F' : '#FFFFFF' }}
          >
            Millux
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-300 hover:text-amber-700 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          <button
            className={`p-2 transition-colors duration-300 hover:text-amber-700 ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            className={`p-2 transition-colors duration-300 hover:text-amber-700 ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>

          <button
            className={`p-2 transition-colors duration-300 hover:text-amber-700 ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors duration-300 ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-b border-gray-100 absolute top-[72px] left-0 right-0"
        >
          <div className="container-wide py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default PremiumNavbar;
