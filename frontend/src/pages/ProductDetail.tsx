import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingBag, Heart, Share2, Truck, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  
  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
      } catch (error) {
        toast.error("Product not found");
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.warning("Please select a size");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.images[0],
      size: selectedSize || undefined,
      quantity
    });
    
    toast.success("Added to cart!");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to give a review");
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success("Review submitted successfully!");
      // Refresh product data
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      setComment('');
      setRating(5);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A4BFF]"></div>
      </div>
    );
  }

  if (!product) return null;

  const discountedPrice = (product.price * (1 - product.discount/100)).toFixed(0);

  return (
    <div className="bg-white min-h-screen py-10 md:py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-8 font-medium">
          Home / {product.category} / <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Product Images (Left) */}
          <div className="flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-28 h-fit">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:w-20 flex-shrink-0 hide-scrollbar scroll-smooth">
              {product.images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-[#5A4BFF] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover mix-blend-multiply bg-gray-100" />
                </button>
              ))}
            </div>
            
            <div className="flex-grow bg-gray-50 rounded-2xl overflow-hidden relative min-h-[400px] md:min-h-[600px] flex items-center justify-center p-8">
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 bg-[#FF3B30] text-white text-sm font-bold px-3 py-1.5 rounded-md shadow-lg z-10">
                  {product.discount}% OFF
                </div>
              )}
              <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
                <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-[#FF3B30] transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-[#5A4BFF] transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain max-h-[600px] mix-blend-multiply transition-opacity duration-300" 
              />
            </div>
          </div>

          {/* Product Info (Right) */}
          <div className="flex flex-col">
            <div className="mb-8">
              <p className="text-[#5A4BFF] font-semibold text-sm tracking-widest uppercase mb-3">{product.category} • {product.gender}</p>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">{product.name}</h1>
              
              <div className="flex items-end gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900 leading-none">₹{discountedPrice}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xl text-gray-400 line-through leading-none mb-1">₹{product.price}</span>
                  </>
                )}
              </div>
              <p className="text-xs font-medium text-gray-400 bg-gray-100 inline-block px-3 py-1 rounded w-fit">Inclusive of all taxes</p>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8 border-t border-gray-100 pt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Select Size</h3>
                  <button className="text-sm font-medium text-[#5A4BFF] underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[4rem] h-12 rounded-xl flex items-center justify-center font-medium transition-all text-sm
                        ${selectedSize === size 
                          ? 'bg-[#111111] text-white border-2 border-[#111111] shadow-md shadow-black/10' 
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-black hover:text-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl h-12 w-32 bg-gray-50/50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full text-gray-500 hover:text-black hover:bg-gray-100 rounded-l-xl transition-colors font-medium text-lg">-</button>
                  <span className="flex-1 text-center font-semibold text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-full text-gray-500 hover:text-black hover:bg-gray-100 rounded-r-xl transition-colors font-medium text-lg">+</button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                className="flex-[2] bg-[#FF3B30] text-white h-14 rounded-full font-medium hover:bg-[#e6352b] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF3B30]/30 hover:scale-[1.02]"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
            </div>

            {/* Delivery & Trust */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 mb-10 border border-gray-100">
              <div className="flex items-start gap-4">
                <Truck className="w-6 h-6 text-[#5A4BFF] flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Free Delivery</h4>
                  <p className="text-sm text-gray-500 mt-1">Enter postal code for Delivery Availability</p>
                </div>
              </div>
              <div className="h-px bg-gray-200 w-full ml-10"></div>
              <div className="flex items-start gap-4">
                <RotateCcw className="w-6 h-6 text-[#5A4BFF] flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Return Delivery</h4>
                  <p className="text-sm text-gray-500 mt-1">Free 30 Days Delivery Returns.</p>
                </div>
              </div>
              <div className="h-px bg-gray-200 w-full ml-10"></div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-[#5A4BFF] flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Authentic Products</h4>
                  <p className="text-sm text-gray-500 mt-1">100% Original Guarantee on all items.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-8 mb-12">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">Product Details</h3>
              <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 text-2xl mb-1">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">{product.rating.toFixed(1)} out of 5 ({product.numReviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Review Form */}
              {user && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4">Write a Review</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className={`p-2 rounded-lg transition-all ${rating >= s ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                          >
                            <Star className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                      <textarea
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or dislike about this product?"
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#5A4BFF] focus:outline-none min-h-[100px]"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-[#111111] text-white px-8 py-3 rounded-full font-medium hover:bg-[#333333] transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev: any, idx: number) => (
                    <div key={idx} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900">{rev.username}</p>
                          <div className="flex text-yellow-400 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
