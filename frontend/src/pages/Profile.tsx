import { User, Mail, ShieldCheck, ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'CUSTOMER') {
      const fetchOrders = async () => {
        try {
          const res = await api.get('/orders/my-orders');
          setRecentOrders(res.data.slice(0, 3)); // Show last 3 orders
        } catch (error) {
          console.error("Error fetching profile orders:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-[#F5F5F5] min-h-screen py-10">
      <div className="max-w-[800px] mx-auto px-6">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="premium-card bg-white p-8 mb-8">
          <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
            <div className="w-24 h-24 bg-gradient-to-tr from-[#5A4BFF] to-[#3B82F6] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#5A4BFF]/30">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-500">{user.role === 'ADMIN' ? 'Administrator Account' : 'Customer Account'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </p>
              <p className="text-lg font-semibold text-gray-900">{user.username}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </p>
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Account Role
              </p>
              <p className="text-lg font-semibold text-gray-900">
                <span className={`px-3 py-1 text-sm rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                  {user.role}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Customer Only: Recent Orders Section */}
        {user.role === 'CUSTOMER' && (
          <div className="premium-card bg-white p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#5A4BFF]" /> Your Recent Orders
              </h2>
              <Link to="/orders" className="text-sm font-medium text-[#5A4BFF] hover:underline flex items-center">
                View All Orders <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#5A4BFF]"></div>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-500 mb-4 text-sm">You haven't placed any orders yet.</p>
                <Link to="/products" className="text-[#5A4BFF] font-semibold text-sm hover:underline">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Link key={order.id} to="/orders" className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-[#5A4BFF]/30 hover:bg-gray-50/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                        <Clock className="w-6 h-6 text-gray-400 group-hover:text-[#5A4BFF]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₹{order.total_amount}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
