import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      // Sort newest first
      setOrders(res.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order ${orderId.slice(0,8)} status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F5F5F5] min-h-[calc(100vh-80px)] py-8">
      <div className="max-w-[1280px] mx-auto px-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        </div>

        <div className="premium-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-8">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by ID or Customer..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5A4BFF]"
              />
            </div>
            <p className="text-sm font-medium text-gray-500">{filteredOrders.length} orders</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                  <th className="py-3 px-6 font-semibold">Order ID & Date</th>
                  <th className="py-3 px-6 font-semibold">Customer Details</th>
                  <th className="py-3 px-6 font-semibold">Payment</th>
                  <th className="py-3 px-6 font-semibold">Total Amount</th>
                  <th className="py-3 px-6 font-semibold">Current Status</th>
                  <th className="py-3 px-6 font-semibold text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">Loading...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No orders found</td></tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900 border border-gray-200 bg-gray-100 px-2 py-0.5 rounded text-xs w-fit mb-1 font-mono">#{o.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900">{o.customer_name}</p>
                        <p className="text-xs text-gray-500">{o.customer_email}</p>
                        <p className="text-xs text-gray-500">{o.mobile}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded border border-gray-200 text-gray-700">
                          {o.payment_method}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900">₹{o.total_amount}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border
                          ${o.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                            o.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                            o.status === 'IN_TRANSIT' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <select 
                          value={o.status}
                          disabled={o.status === 'CANCELLED' || o.status === 'DELIVERED'}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#5A4BFF] focus:border-[#5A4BFF] block w-full p-2 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="IN_TRANSIT">IN_TRANSIT</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
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
  );
};

export default AdminOrders;
