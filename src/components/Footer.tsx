
import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">MilluxCollections</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Premium bags for every occasion. Discover our curated collection of handbags, 
              travel bags, and accessories that combine style with functionality.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">info@milluxcollections.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-gray-300 hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Handbags for Women</span></li>
              <li><span className="text-gray-300">Travel Bags</span></li>
              <li><span className="text-gray-300">Laptop Bags</span></li>
              <li><span className="text-gray-300">Men Bags</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 MilluxCollections. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
