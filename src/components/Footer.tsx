
import { Link } from "react-router-dom";
import { ShoppingBag, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-8 w-8 mr-2 text-brand-accent" />
              <span className="text-xl font-bold">MilluxCollections</span>
            </div>
            <p className="text-brand-light/80 mb-4 max-w-md">
              Premium bags for every occasion. Discover our curated collection of handbags, 
              travel bags, and accessories that combine style with functionality.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-brand-light/80">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">info@milluxcollections.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-brand-light/80 hover:text-brand-accent transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-brand-light/80 hover:text-brand-accent transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-brand-light/80 hover:text-brand-accent transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-brand-light/80 hover:text-brand-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand-accent">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-brand-light/80 hover:text-brand-accent transition-colors">Handbags for Women</Link></li>
              <li><Link to="/shop" className="text-brand-light/80 hover:text-brand-accent transition-colors">Travel Bags</Link></li>
              <li><Link to="/shop" className="text-brand-light/80 hover:text-brand-accent transition-colors">Laptop Bags</Link></li>
              <li><Link to="/shop" className="text-brand-light/80 hover:text-brand-accent transition-colors">Men Bags</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-primary/30 mt-8 pt-8 text-center">
          <p className="text-brand-light/70">
            © 2025 MilluxCollections. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
