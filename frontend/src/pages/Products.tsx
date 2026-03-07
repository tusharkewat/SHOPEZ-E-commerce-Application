import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search, Star } from 'lucide-react';
import api from '../services/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const gender = searchParams.get('gender') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (category) query.append('category', category);
        if (search) query.append('search', search);
        if (gender) query.append('gender', gender);
        if (sort) query.append('sort', sort);

        const res = await api.get(`/products?${query.toString()}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, gender, sort]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen py-10">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {search ? `Search results for "${search}"` : category ? `${category}` : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm">{products.length} items found</p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6 flex justify-between items-center">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 font-medium text-sm"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          
          <select 
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-white border text-sm border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#5A4BFF]"
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-[#FF3B30] font-medium hover:underline">Clear All</button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-medium text-sm text-gray-900 mb-3 uppercase tracking-wider">Category</h4>
                <div className="space-y-2">
                  {['Fashion', 'Electronics', 'Mobiles', 'Groceries', 'Sports Equipment'].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${category === cat ? 'bg-[#5A4BFF] border-[#5A4BFF]' : 'border-gray-300 group-hover:border-[#5A4BFF]'}`}>
                        {category === cat && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <input 
                        type="radio" 
                        name="category"
                        value={cat} 
                        checked={category === cat}
                        onChange={(e) => updateFilter('category', e.target.value)}
                        className="hidden" 
                      />
                      <span className={`text-sm ${category === cat ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="mb-8">
                <h4 className="font-medium text-sm text-gray-900 mb-3 uppercase tracking-wider">Gender</h4>
                <div className="space-y-2">
                  {['MEN', 'WOMEN', 'UNISEX'].map((g) => (
                    <label key={g} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${gender === g ? 'bg-[#5A4BFF] border-[#5A4BFF]' : 'border-gray-300 group-hover:border-[#5A4BFF]'}`}>
                        {gender === g && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <input 
                        type="radio" 
                        name="gender"
                        value={g} 
                        checked={gender === g}
                        onChange={(e) => updateFilter('gender', e.target.value)}
                        className="hidden" 
                      />
                      <span className={`text-sm ${gender === g ? 'font-medium text-gray-900' : 'text-gray-600'} capitalize`}>{g.toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Desktop Sort */}
              <div className="hidden md:block">
                <h4 className="font-medium text-sm text-gray-900 mb-3 uppercase tracking-wider">Sort By</h4>
                <select 
                  value={sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5A4BFF] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="premium-card h-80 animate-pulse bg-white"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">We couldn't find anything matching your current filters.</p>
                <button onClick={clearFilters} className="bg-[#111111] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#333333] transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="premium-card flex flex-col group bg-white border border-transparent hover:border-gray-100">
                    <Link to={`/products/${p.id}`} className="relative h-64 bg-gray-100 overflow-hidden block">
                      {p.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-[#FF3B30] text-white text-xs font-bold px-2.5 py-1 rounded shadow-md z-10">
                          {p.discount}% OFF
                        </div>
                      )}
                      <img 
                        src={p.images[0] || 'https://via.placeholder.com/300'} 
                        alt={p.name} 
                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-[11px] text-gray-500 mb-1.5 uppercase font-medium tracking-wider">{p.category}</p>
                      <Link to={`/products/${p.id}`}>
                        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-[#5A4BFF] transition-colors">{p.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.round(p.rating || 0) ? 'fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-medium text-gray-400">({p.numReviews || 0})</span>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                        <div className="flex flex-col">
                          <span className="font-bold text-xl text-gray-900 leading-none">₹{(p.price * (1 - p.discount/100)).toFixed(0)}</span>
                          {p.discount > 0 && <span className="text-gray-400 text-sm line-through mt-1">₹{p.price}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Products;
