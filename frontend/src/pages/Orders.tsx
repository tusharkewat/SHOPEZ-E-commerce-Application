import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch (error) {
        toast.error('Failed to fetch orders');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'PLACED': return { icon: <Clock className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Order Placed' };
      case 'IN_TRANSIT': return { icon: <Truck className="w-5 h-5" />, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'In Transit' };
      case 'DELIVERED': return { icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-50', label: 'Delivered' };
      case 'CANCELLED': return { icon: <XCircle className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' };
      default: return { icon: <Package className="w-5 h-5" />, color: 'text-gray-600', bg: 'bg-gray-50', label: status };
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'CANCELLED' });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A4BFF]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen py-10">
      <div className="max-w-[1000px] mx-auto px-6">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="premium-card bg-white p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">When you place an order, it will appear here.</p>
            <a href="/products" className="bg-[#111111] text-white px-8 py-3 rounded-full font-medium hover:bg-[#333333] transition-colors inline-block">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = getStatusConfig(order.status);
              return (
                <div key={order.id} className="premium-card bg-white overflow-hidden">
                  
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-900 font-medium">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                        <p className="text-lg font-bold text-gray-900">₹{order.total_amount}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${status.bg} ${status.color}`}>
                        {status.icon}
                        <span className="text-sm font-semibold">{status.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} alt={item.product?.name} className="w-full h-full object-cover mix-blend-multiply" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 line-clamp-1">{item.product?.name || 'Product deleted'}</h4>
                            <p className="text-gray-500 text-sm mt-1">
                              Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                            </p>
                            <p className="font-medium text-gray-900 mt-2">₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    {order.status === 'PLACED' && (
                      <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-[#FF3B30] border border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
