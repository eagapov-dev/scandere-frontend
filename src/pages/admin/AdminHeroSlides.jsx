import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cta_text: '',
    cta_link: '',
    bg_gradient: '',
    icon: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminHeroSlides();
      setSlides(data || []);
    } catch (err) {
      console.error('Failed to load hero slides:', err);
      alert('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      cta_text: '',
      cta_link: '',
      bg_gradient: '',
      icon: '',
      sort_order: 0,
      is_active: true
    });
    setShowModal(true);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      cta_text: slide.cta_text,
      cta_link: slide.cta_link,
      bg_gradient: slide.bg_gradient,
      icon: slide.icon,
      sort_order: slide.sort_order || 0,
      is_active: slide.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSlide) {
        await api.updateHeroSlide(editingSlide.id, formData);
      } else {
        await api.createHeroSlide(formData);
      }
      setShowModal(false);
      loadSlides();
    } catch (err) {
      console.error('Failed to save hero slide:', err);
      alert(err.response?.data?.message || 'Failed to save hero slide. Please check all fields.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.deleteHeroSlide(id);
      loadSlides();
    } catch (err) {
      console.error('Failed to delete hero slide:', err);
      alert(err.response?.data?.message || 'Failed to delete hero slide');
    }
  };

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-gray-500 mt-1">Manage homepage banner carousel</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          <FiPlus size={20} />
          Create Slide
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sort</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {slides.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No slides found. Create your first slide to get started.
                    </td>
                  </tr>
                ) : (
                  slides.map((slide) => (
                    <tr key={slide.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                        <div className="line-clamp-2">{slide.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {slide.cta_text}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">
                        {slide.icon}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-900">
                        {slide.sort_order || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          slide.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {slide.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <button
                          onClick={() => handleEdit(slide)}
                          className="text-brand-600 hover:text-brand-700 mr-3"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(slide.id, slide.title)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
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
                {editingSlide ? 'Edit Hero Slide' : 'Create Hero Slide'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  required
                  placeholder="e.g., Launch Your Business With Confidence"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle *</label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  rows="3"
                  required
                  placeholder="Professional templates, checklists, and guides..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text *</label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    required
                    placeholder="Browse Products"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link *</label>
                  <input
                    type="text"
                    value={formData.cta_link}
                    onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    required
                    placeholder="/products"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Gradient *</label>
                <input
                  type="text"
                  value={formData.bg_gradient}
                  onChange={(e) => setFormData({ ...formData, bg_gradient: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm"
                  required
                  placeholder="from-brand-700 via-brand-800 to-brand-900"
                />
                <p className="text-xs text-gray-500 mt-1">Tailwind gradient classes</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name *</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm"
                  required
                  placeholder="FiTrendingUp"
                />
                <p className="text-xs text-gray-500 mt-1">React Icons name (e.g., FiTrendingUp, FiPackage)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first.</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Active (visible on homepage)</span>
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
                  className="px-4 py-2 text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
                >
                  {editingSlide ? 'Update Slide' : 'Create Slide'}
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
