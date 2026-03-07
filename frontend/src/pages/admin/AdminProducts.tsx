import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '0',
    category: '',
    gender: 'UNISEX',
    stock: '100',
    images: '',
    sizes: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/seller');
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        discount: product.discount?.toString() || '0',
        category: product.category,
        gender: product.gender,
        stock: product.stock.toString(),
        images: product.images ? product.images.join(', ') : '',
        sizes: product.sizes ? product.sizes.join(', ') : ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', description: '', price: '', discount: '0',
        category: '', gender: 'UNISEX', stock: '100', images: '', sizes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Process comma-separated arrays
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount),
      stock: parseInt(formData.stock),
      images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim().toUpperCase()).filter(Boolean) : []
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      }
      handleCloseModal();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F5F5F5] min-h-[calc(100vh-80px)] py-8">
      <div className="max-w-[1280px] mx-auto px-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#5A4BFF] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#4a3dec] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add New Product
          </button>
        </div>

        <div className="premium-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-8">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5A4BFF]"
              />
            </div>
            <p className="text-sm font-medium text-gray-500">{filteredProducts.length} items</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                  <th className="py-3 px-6 font-semibold w-16">Image</th>
                  <th className="py-3 px-6 font-semibold">Product Name</th>
                  <th className="py-3 px-6 font-semibold">Category</th>
                  <th className="py-3 px-6 font-semibold">Price</th>
                  <th className="py-3 px-6 font-semibold">Stock</th>
                  <th className="py-3 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">Loading...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No products found</td></tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img src={p.images?.[0] || 'https://via.placeholder.com/100'} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                      </td>
                      <td className="py-3 px-6 font-medium text-gray-900">{p.name}</td>
                      <td className="py-3 px-6 text-sm text-gray-600">{p.category}</td>
                      <td className="py-3 px-6 font-medium text-gray-900">₹{p.price}</td>
                      <td className="py-3 px-6 text-sm text-gray-600">{p.stock}</td>
                      <td className="py-3 px-6 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenModal(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Full-screen Modal container (Tailwind makes it easy to position) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 mt-24">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5A4BFF] outline-none" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} name="description" value={formData.description} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5A4BFF] outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input required type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5A4BFF] outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input type="number" min="0" max="100" name="discount" value={formData.discount} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5A4BFF] outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select required name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5A4BFF] outline-none">
                    <option value="">Select Category</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mobiles">Mobiles</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Sports Equipment">Sports Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender Focus</label>
                  <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5A4BFF] outline-none">
                    <option value="UNISEX">Unisex</option>
                    <option value="MEN">Men</option>
                    <option value="WOMEN">Women</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5A4BFF] outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (Comma separated)</label>
                  <input placeholder="S, M, L, XL" name="sizes" value={formData.sizes} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5A4BFF] outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (Comma separated)</label>
                  <textarea required rows={2} placeholder="https://image1.jpg, https://image2.jpg" name="images" value={formData.images} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5A4BFF] outline-none resize-none" />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-[#5A4BFF] text-white font-medium rounded-lg hover:bg-[#4a3dec] transition-colors shadow-md">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
