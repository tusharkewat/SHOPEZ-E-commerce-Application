import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-20 pb-10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#5A4BFF] text-white flex items-center justify-center">
                S
              </div>
              ShopEZ
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your One-Stop Destination for Online Shopping. Best deals on electronics, fashion, groceries and more.
            </p>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-[#5A4BFF] transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-[#5A4BFF] transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-[#5A4BFF] transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-[#5A4BFF] transition-colors">Electronics</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/profile" className="hover:text-[#5A4BFF] transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="hover:text-[#5A4BFF] transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-[#5A4BFF] transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-[#5A4BFF] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>India</li>
              <li>support@shopez.com</li>
              <li>+91 XXXXX XXXXX</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} ShopEZ. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
