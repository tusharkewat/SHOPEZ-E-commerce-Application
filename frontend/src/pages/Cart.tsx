import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalMRP, totalDiscount, deliveryFee, finalTotal, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/cart' } });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-[#111111] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#333333] transition-colors shadow-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen py-10">
      <div className="max-w-[1280px] mx-auto px-6">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart <span className="text-gray-400 text-xl font-medium">({itemCount} items)</span></h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Cart Items */}
          <div className="flex-grow space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="premium-card bg-white p-4 md:p-6 flex flex-col sm:flex-row gap-6">
                
                {/* Product Image */}
                <Link to={`/products/${item.id}`} className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 block">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </Link>

                {/* Product Details */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <Link to={`/products/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 text-lg hover:text-[#5A4BFF] transition-colors line-clamp-2">{item.name}</h3>
                    </Link>
                    <button 
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-gray-400 hover:text-[#FF3B30] transition-colors p-2 -mr-2 -mt-2"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {item.size && (
                    <p className="text-sm text-gray-500 mb-2">Size: <span className="font-medium text-gray-900">{item.size}</span></p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-200 rounded-lg h-10 w-28 bg-gray-50">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)} className="flex-1 h-full text-gray-500 hover:text-black hover:bg-gray-200 rounded-l-lg transition-colors font-medium">-</button>
                      <span className="flex-1 text-center font-semibold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)} className="flex-1 h-full text-gray-500 hover:text-black hover:bg-gray-200 rounded-r-lg transition-colors font-medium">+</button>
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-2 text-right">
                      {item.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through mb-0.5">₹{item.price * item.quantity}</span>
                      )}
                      <span className="text-xl font-bold text-gray-900">₹{(item.price * (1 - item.discount/100) * item.quantity).toFixed(0)}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="premium-card bg-white p-6 sticky top-28 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total MRP</span>
                  <span className="font-medium text-gray-900">₹{totalMRP.toFixed(0)}</span>
                </div>
                
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-[#2ECC71]">
                    <span>Discount on MRP</span>
                    <span className="font-medium">-₹{totalDiscount.toFixed(0)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="font-medium text-[#2ECC71]">FREE</span>
                  ) : (
                    <span className="font-medium text-gray-900">₹{deliveryFee.toFixed(0)}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                  <span className="font-bold text-2xl text-gray-900">₹{finalTotal.toFixed(0)}</span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-center text-[#5A4BFF] mt-2 font-medium bg-[#5A4BFF]/5 py-2 rounded-lg">
                    Add ₹{(500 - (totalMRP - totalDiscount)).toFixed(0)} more for FREE delivery
                  </p>
                )}
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-[#FF3B30] text-white py-4 rounded-xl font-medium hover:bg-[#e6352b] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF3B30]/30 hover:shadow-xl hover:-translate-y-1"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
                Safe and Secure Payments
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
