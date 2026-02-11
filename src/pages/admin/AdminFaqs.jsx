import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiFolder } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    question: '',
    answer: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadFaqs();
    loadCategories();
  }, []);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminFaqs();
      setFaqs(data || []);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
      alert('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.getAdminFaqCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load FAQ categories:', err);
    }
  };

  const handleCreate = () => {
    setEditingFaq(null);
    setFormData({
      category_id: '',
      question: '',
      answer: '',
      sort_order: 0,
      is_active: true
    });
    setShowModal(true);
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      category_id: faq.category_id || '',
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order || 0,
      is_active: faq.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFaq) {
        await api.updateFaq(editingFaq.id, formData);
      } else {
        await api.createFaq(formData);
      }
      setShowModal(false);
      loadFaqs();
    } catch (err) {
      console.error('Failed to save FAQ:', err);
      alert(err.response?.data?.message || 'Failed to save FAQ. Please check all fields.');
    }
  };

  const handleDelete = async (id, question) => {
    if (!confirm(`Are you sure you want to delete "${question}"?`)) return;

    try {
      await api.deleteFaq(id);
      loadFaqs();
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
      alert(err.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-500 mt-1">Manage frequently asked questions</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/faq-categories"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiFolder size={18} />
            Manage Categories
          </Link>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <FiPlus size={20} />
            Create FAQ
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answer</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sort</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {faqs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No FAQs found. Create your first FAQ to get started.
                    </td>
                  </tr>
                ) : (
                  faqs.map((faq) => (
                    <tr key={faq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        {faq.category ? (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-brand-100 text-brand-700">
                            {faq.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">No category</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                        <div className="line-clamp-2">{faq.question}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                        <div className="line-clamp-2">{faq.answer}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-900">
                        {faq.sort_order || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          faq.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="text-brand-600 hover:text-brand-700 mr-3"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id, faq.question)}
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
                {editingFaq ? 'Edit FAQ' : 'Create FAQ'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">No category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Optional - group FAQs by category</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  required
                  placeholder="e.g., How do I download my purchased products?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  rows="5"
                  required
                  placeholder="Enter the answer to this question..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order (within category)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first within the category.</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Active (visible on FAQ page)</span>
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
                  {editingFaq ? 'Update FAQ' : 'Create FAQ'}
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
