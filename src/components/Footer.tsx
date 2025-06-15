
import { Link } from "react-router-dom";
import { ShoppingBag, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-brand-accent" />
              <span className="text-lg sm:text-xl font-bold">MilluxCollections</span>
            </div>
            <p className="text-brand-light/80 mb-4 max-w-md text-sm sm:text-base">
              Premium bags for every occasion. Discover our curated collection of handbags, 
              travel bags, and accessories that combine style with functionality.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-brand-light/80">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-xs sm:text-sm">info@milluxcollections.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-brand-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-brand-light/80 hover:text-brand-accent transition-colors text-sm sm:text-base">Home</Link></li>
              <li><Link to="/shop" className="text-brand-light/80 hover:text-brand-accent transition-colors text-sm sm:text-base">Shop</Link></li>
              <li><Link to="/about" className="text-brand-light/80 hover:text-brand-accent transition-colors text-sm sm:text-base">About</Link></li>
              <li><Link to="/contact" className="text-brand-light/80 hover:text-brand-accent transition-colors text-sm sm:text-base">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-brand-accent">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-brand-light/80 hover:text-brand-accent transition-colors text-sm sm:text-base">Handbags for Women</Link></li>
              <li><Link to="/shop" className="text-brand-light/80 hover:text-brand-accent transition-colors text-sm sm:text-base">Travel Bags</Link></li>
              <li><Link to="/shop" className="text-brand-light/80 hover:text-brand-accent transition-colors text-sm sm:text-base">Laptop Bags</Link></li>
              <li><Link to="/shop" className="text-brand-light/80 hover:text-brand-accent transition-colors text-sm sm:text-base">Men Bags</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-primary/30 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-brand-light/70 text-xs sm:text-sm">
            © 2025 MilluxCollections. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
