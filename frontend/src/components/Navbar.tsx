import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to={user?.role === 'ADMIN' ? "/admin" : "/"} className="text-2xl font-bold tracking-tight text-[#111111] flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#5A4BFF] text-white flex items-center justify-center">
            S
          </div>
          ShopEZ
        </Link>

        {/* Desktop Nav */}
        {user?.role !== 'ADMIN' && (
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#777777]">
            <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
            <Link to="/products" className="hover:text-[#111111] transition-colors">Products</Link>
            <Link to="/products?category=Fashion" className="hover:text-[#111111] transition-colors">Categories</Link>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {user?.role !== 'ADMIN' && (
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 absolute left-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#5A4BFF] focus:outline-none w-[200px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/products?search=${e.currentTarget.value}`);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          )}

          {user?.role !== 'ADMIN' && (
            <Link to="/cart" className="relative p-2 text-[#111111] hover:text-[#5A4BFF] transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF3B30] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="hidden md:flex items-center gap-1 text-sm font-medium text-[#5A4BFF] bg-[#5A4BFF]/10 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-4 h-4" /> Admin
                </Link>
              )}
              <Link to="/profile" className="p-2 text-[#111111] hover:text-[#5A4BFF] transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={handleLogout} className="p-2 text-[#777777] hover:text-[#FF3B30] transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-[#111111] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#333333] transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
