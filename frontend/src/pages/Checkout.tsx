import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Checkout = () => {
  const { items, totalMRP, totalDiscount, deliveryFee, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: user?.username || '',
    customerEmail: user?.email || '',
    mobile: '',
    address: '',
    pincode: '',
    paymentMethod: 'COD'
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price * (1 - item.discount / 100),
        size: item.size
      }));

      const payload = {
        ...formData,
        totalAmount: finalTotal,
        items: orderItems
      };

      const res = await api.post('/orders', payload);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders', { state: { newOrderId: res.data.id } });
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen py-10">
      <div className="max-w-[1280px] mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Checkout Form */}
          <div className="flex-grow">
            <div className="premium-card bg-white p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      required type="text" name="customerName"
                      value={formData.customerName} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A4BFF] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      required type="email" name="customerEmail"
                      value={formData.customerEmail} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A4BFF] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input 
                      required type="tel" name="mobile"
                      value={formData.mobile} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A4BFF] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input 
                      required type="text" name="pincode"
                      value={formData.pincode} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A4BFF] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Delivery Address</label>
                  <textarea 
                    required name="address" rows={3}
                    value={formData.address} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A4BFF] outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#5A4BFF] transition-colors has-[:checked]:border-[#5A4BFF] has-[:checked]:bg-[#5A4BFF]/5">
                      <input 
                        type="radio" name="paymentMethod" value="COD"
                        checked={formData.paymentMethod === 'COD'} onChange={handleChange}
                        className="w-4 h-4 text-[#5A4BFF]"
                      />
                      <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#5A4BFF] transition-colors has-[:checked]:border-[#5A4BFF] has-[:checked]:bg-[#5A4BFF]/5">
                      <input 
                        type="radio" name="paymentMethod" value="NET_BANKING"
                        checked={formData.paymentMethod === 'NET_BANKING'} onChange={handleChange}
                        className="w-4 h-4 text-[#5A4BFF]"
                      />
                      <span className="font-medium text-gray-900">Net Banking / UPI (Simulator)</span>
                    </label>
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="premium-card bg-white p-6 sticky top-28 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
                    </div>
                    <div className="font-medium text-gray-900">
                      ₹{((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Total MRP</span>
                  <span>₹{totalMRP.toFixed(0)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-[#2ECC71]">
                    <span>Discount</span>
                    <span>-₹{totalDiscount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(0)}`}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 mb-8">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900 text-lg">Amount to Pay</span>
                  <span className="font-bold text-2xl text-[#FF3B30]">₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-[#FF3B30] text-white py-4 rounded-xl font-medium hover:bg-[#e6352b] transition-all flex items-center justify-center disabled:opacity-70 shadow-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
