import { useEffect, useState } from 'react';
import { Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AdminBanner = () => {
  const [currentBanner, setCurrentBanner] = useState('');
  const [newBanner, setNewBanner] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBanner = async () => {
    try {
      const res = await api.get('/banner');
      setCurrentBanner(res.data?.image_url || '');
      setNewBanner(res.data?.image_url || '');
    } catch (error) {
      toast.error('Failed to fetch banner settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleSave = async () => {
    if (!newBanner) {
      toast.warning('Please enter a banner URL');
      return;
    }
    
    setSaving(true);
    try {
      await api.put('/banner', { imageUrl: newBanner });
      setCurrentBanner(newBanner);
      toast.success('Home banner updated successfully');
    } catch (error) {
      toast.error('Failed to update banner');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-[calc(100vh-80px)] py-8">
      <div className="max-w-[1000px] mx-auto px-6">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-[#5A4BFF]" />
            Manage Homepage Banner
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Settings Form */}
          <div className="premium-card bg-white p-6 md:p-8 h-fit pb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Banner Configuration</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
              <textarea 
                rows={3}
                value={newBanner}
                onChange={(e) => setNewBanner(e.target.value)}
                placeholder="https://example.com/banner-image.jpg"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A4BFF] focus:border-[#5A4BFF] outline-none resize-none bg-gray-50"
              />
              <p className="mt-2 text-xs text-gray-500">Provide a direct link to an image. Recommended aspect ratio: 21:9.</p>
            </div>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#111111] text-white py-3.5 rounded-xl font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-md"
            >
              {saving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {saving ? 'Saving Changes...' : 'Save Banner Settings'}
            </button>
          </div>

          {/* Live Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Live Preview</h2>
            <div className="premium-card bg-white rounded-2xl overflow-hidden border border-gray-200 relative aspect-video flex-col flex select-none">
              
              <div className="bg-white h-8 border-b border-gray-200 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 flex-grow bg-gray-100 h-5 rounded flex items-center px-2 text-[10px] text-gray-400 font-mono">
                  shopez.com/
                </div>
              </div>

              <div className="relative flex-grow bg-gray-100">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
                  </div>
                ) : newBanner ? (
                  <>
                    <img src={newBanner} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center px-4">
                        <h3 className="text-white text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">SUPER SALE</h3>
                        <p className="text-white/80 text-xs md:text-sm mt-2">Shop Your Favorites</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm font-medium">No Image Provided</p>
                  </div>
                )}
              </div>

            </div>
            
            {newBanner !== currentBanner && !saving && (
              <p className="text-sm text-amber-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                You have unsaved changes
              </p>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminBanner;
