import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Image as ImageIcon, TrendingUp, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products/seller'),
          api.get('/orders')
        ]);
        
        const products = productsRes.data;
        const orders = ordersRes.data;

        const totalRev = orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

        setStats({
          productsCount: products.length,
          ordersCount: orders.length,
          totalRevenue: totalRev,
        });

        // Get 5 most recent orders
        setRecentOrders(orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A4BFF]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen py-10">
      <div className="max-w-[1280px] mx-auto px-6">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="premium-card bg-white p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                <TrendingUp className="w-4 h-4 mr-1" /> +12%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>

          <div className="premium-card bg-white p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.ordersCount}</h3>
          </div>

          <div className="premium-card bg-white p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.productsCount}</h3>
          </div>
        </div>

        {/* Quick Links & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Management</h2>
            
            <Link to="/admin/products" className="premium-card bg-white p-5 flex items-center justify-between group hover:border-[#5A4BFF] transition-colors border border-transparent cursor-pointer block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#5A4BFF] transition-colors">Manage Products</h3>
                  <p className="text-sm text-gray-500">Add, edit, or delete items</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/orders" className="premium-card bg-white p-5 flex items-center justify-between group hover:border-[#5A4BFF] transition-colors border border-transparent cursor-pointer block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#5A4BFF] transition-colors">Manage Orders</h3>
                  <p className="text-sm text-gray-500">View and update statuses</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/banner" className="premium-card bg-white p-5 flex items-center justify-between group hover:border-[#5A4BFF] transition-colors border border-transparent cursor-pointer block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#5A4BFF] transition-colors">Manage Banner</h3>
                  <p className="text-sm text-gray-500">Update homepage hero image</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-2">
            <div className="premium-card bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link to="/admin/orders" className="text-sm font-medium text-[#5A4BFF] hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                      <th className="py-4 px-6 font-medium">Order ID</th>
                      <th className="py-4 px-6 font-medium">Date</th>
                      <th className="py-4 px-6 font-medium">Customer</th>
                      <th className="py-4 px-6 font-medium">Amount</th>
                      <th className="py-4 px-6 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-gray-500">No recent orders</td></tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">#{order.id.slice(0,8)}</td>
                          <td className="py-4 px-6 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-6 text-sm text-gray-900">{order.customer_name}</td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">₹{order.total_amount}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full
                              ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                order.status === 'IN_TRANSIT' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
