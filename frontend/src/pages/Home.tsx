import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [bannerUrl, setBannerUrl] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [bannerRes, productsRes] = await Promise.all([
          api.get('/banner'),
          api.get('/products?sort=createdAt')
        ]);
        const fallbackImage = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2070';
        setBannerUrl(bannerRes.data?.image_url ? bannerRes.data.image_url : fallbackImage);
        setFeaturedProducts(productsRes.data.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const categories = [
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800' },
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800' },
    { name: 'Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800' },
    { name: 'Groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sports Equipment', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A4BFF]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bannerUrl} alt="Hero Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            SUPER SALE <br /> <span className="text-[#FF3B30]">Shop Your Favorites</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 drop-shadow">
            Best deals on electronics, fashion, groceries and more.
          </p>
          <Link to="/products" className="bg-[#FF3B30] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#e6352b] transition-all hover:scale-105 inline-block shadow-xl">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="premium-section bg-white">
        <div className="bg-text top-10 left-0">CATEGORIES</div>
        <div className="premium-container relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[#5A4BFF] font-semibold text-sm tracking-wider uppercase mb-2">Discover</p>
              <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat.name}`} key={cat.name} className="group premium-card block">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 text-[#2ECC71] rounded-full flex items-center justify-center mb-4 text-xl">🚚</div>
              <h4 className="font-semibold text-gray-900 mb-1">Fast Delivery</h4>
              <p className="text-xs text-gray-500">Across the country</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-[#3B82F6] rounded-full flex items-center justify-center mb-4 text-xl">🔒</div>
              <h4 className="font-semibold text-gray-900 mb-1">Secure Payment</h4>
              <p className="text-xs text-gray-500">100% Protected</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 text-[#5A4BFF] rounded-full flex items-center justify-center mb-4 text-xl">✨</div>
              <h4 className="font-semibold text-gray-900 mb-1">Quality Products</h4>
              <p className="text-xs text-gray-500">Top brands only</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-red-100 text-[#FF3B30] rounded-full flex items-center justify-center mb-4 text-xl">❤️</div>
              <h4 className="font-semibold text-gray-900 mb-1">Customer Satisfaction</h4>
              <p className="text-xs text-gray-500">24/7 Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="premium-section bg-[#F5F5F5]">
        <div className="bg-text top-10 right-0 text-right">TRENDING</div>
        <div className="premium-container relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[#3B82F6] font-semibold text-sm tracking-wider uppercase mb-2">New Arrivals</p>
              <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
            </div>
            <Link to="/products" className="text-[#111111] font-medium border-b-2 border-black pb-1 hover:text-[#5A4BFF] hover:border-[#5A4BFF] transition-colors">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length === 0 ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="premium-card h-80 animate-pulse bg-gray-200"></div>
              ))
            ) : (
              featuredProducts.map((p) => (
                <div key={p.id} className="premium-card flex flex-col group bg-white">
                  <Link to={`/products/${p.id}`} className="relative h-60 bg-gray-100 overflow-hidden block">
                    {p.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-[#FF3B30] text-white text-xs font-bold px-2 py-1 rounded z-10">
                        {p.discount}% OFF
                      </div>
                    )}
                    <img 
                      src={p.images[0] || 'https://via.placeholder.com/300'} 
                      alt={p.name} 
                      className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">{p.category}</p>
                    <Link to={`/products/${p.id}`}>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 hover:text-[#5A4BFF] transition-colors">{p.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.round(p.rating || 0) ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">({p.numReviews || 0})</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xl text-gray-900">₹{(p.price * (1 - p.discount/100)).toFixed(0)}</span>
                        {p.discount > 0 && <span className="text-gray-400 text-sm line-through">₹{p.price}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Promos Section */}
      <section className="py-20 bg-[#111111] text-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-gradient-to-r from-[#5A4BFF] to-[#3B82F6] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-xl text-center md:text-left mb-10 md:mb-0">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-md">
                LIMITED TIME OFFER
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Get 20% Off Your First Order</h2>
              <p className="text-lg text-white/80 mb-8">
                Join ShopEZ today and enjoy exclusive discounts, early access to sales, and free shipping on orders over ₹499.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/register" className="bg-white text-[#111111] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors text-center shadow-lg">
                  Sign Up Now
                </Link>
                <Link to="/products" className="bg-transparent border-2 border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors text-center">
                  Explore Deals
                </Link>
              </div>
            </div>
            
            <div className="relative z-10 bg-[#FF3B30] w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center border-8 border-white/20 shadow-2xl transform rotate-12 shrink-0">
              <div className="text-center transform -rotate-12">
                <span className="block text-5xl md:text-7xl font-bold">20%</span>
                <span className="block text-2xl font-bold">OFF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
