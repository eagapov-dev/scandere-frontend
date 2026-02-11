import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiPackage, FiHome, FiCheck } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

export default function AdminBundles() {
  const [bundles, setBundles] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    is_active: true,
    show_on_homepage: false,
    product_ids: []
  });

  useEffect(() => {
    loadBundles();
    loadProducts();
  }, []);

  const loadBundles = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminBundles();
      setBundles(data || []);
    } catch (err) {
      console.error('Failed to load bundles:', err);
      alert('Failed to load bundles');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const handleCreate = () => {
    setEditingBundle(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      is_active: true,
      show_on_homepage: false,
      product_ids: []
    });
    setShowModal(true);
  };

  const handleEdit = (bundle) => {
    setEditingBundle(bundle);
    setFormData({
      title: bundle.title,
      description: bundle.description || '',
      price: bundle.price,
      is_active: bundle.is_active,
      show_on_homepage: bundle.show_on_homepage || false,
      product_ids: bundle.products?.map(p => p.id) || []
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBundle) {
        await api.updateBundle(editingBundle.id, formData);
      } else {
        await api.createBundle(formData);
      }
      setShowModal(false);
      loadBundles();
    } catch (err) {
      console.error('Failed to save bundle:', err);
      alert('Failed to save bundle. Please check all fields.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.deleteBundle(id);
      loadBundles();
    } catch (err) {
      console.error('Failed to delete bundle:', err);
      alert('Failed to delete bundle');
    }
  };

  const toggleProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : [...prev.product_ids, productId]
    }));
  };

  const calculateOriginalPrice = () => {
    const selectedProducts = products.filter(p => formData.product_ids.includes(p.id));
    return selectedProducts.reduce((sum, p) => sum + parseFloat(p.price), 0);
  };

  const originalPrice = calculateOriginalPrice();
  const savings = originalPrice > 0 && formData.price ? (originalPrice - parseFloat(formData.price)).toFixed(2) : 0;

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bundles</h1>
          <p className="text-gray-500 mt-1">Manage product bundles and deals</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          <FiPlus size={20} />
          Create Bundle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Savings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Homepage</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bundles.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                      No bundles found. Create your first bundle to get started.
                    </td>
                  </tr>
                ) : (
                  bundles.map((bundle) => {
                    const originalPrice = bundle.products?.reduce((sum, p) => sum + parseFloat(p.price), 0) || 0;
                    const savings = originalPrice - parseFloat(bundle.price);
                    return (
                      <tr key={bundle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{bundle.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {bundle.products?.length || 0} products
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>
                            <div className="text-xs text-gray-400 line-through">${originalPrice.toFixed(2)}</div>
                            <div className="font-medium">${parseFloat(bundle.price).toFixed(2)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Save ${savings.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            bundle.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {bundle.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {bundle.show_on_homepage ? (
                            <div className="inline-flex items-center gap-1 text-brand-600">
                              <FiHome size={18} />
                              <FiCheck size={14} />
                            </div>
                          ) : (
                            <FiX className="text-gray-300 mx-auto" size={18} />
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <button
                            onClick={() => handleEdit(bundle)}
                            className="text-brand-600 hover:text-brand-700 mr-3"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(bundle.id, bundle.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingBundle ? 'Edit Bundle' : 'Create Bundle'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bundle Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  required
                  placeholder="e.g. Complete Business Starter Pack"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  rows="3"
                  placeholder="Describe what's included in this bundle..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Products * <span className="text-gray-400 text-xs">(choose at least 2)</span>
                </label>
                <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                  {products.map((product) => (
                    <label key={product.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.product_ids.includes(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-gray-900">{product.title}</span>
                        <span className="text-sm text-gray-500">${parseFloat(product.price).toFixed(2)}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {formData.product_ids.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.product_ids.length} products selected • Original total: ${originalPrice.toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bundle Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  required
                  placeholder="e.g. 24.99"
                />
                {savings > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    Customers save ${savings} ({Math.round((savings / originalPrice) * 100)}% off)
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.show_on_homepage}
                    onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Show on Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formData.product_ids.length < 2}
                  className="px-4 py-2 text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingBundle ? 'Update Bundle' : 'Create Bundle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
