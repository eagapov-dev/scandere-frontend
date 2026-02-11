import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

export default function AdminHomeShowcases() {
  const [showcases, setShowcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    gradient: '',
    features: ['', '', ''],
    reverse: false,
    sort_order: 0,
    is_active: true
  });

  useEffect(() => { loadShowcases(); }, []);

  const loadShowcases = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminHomeShowcases();
      setShowcases(data || []);
    } catch (err) {
      alert('Failed to load showcases');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setFormData({ title: '', description: '', icon: '', gradient: '', features: ['', '', ''], reverse: false, sort_order: 0, is_active: true });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon,
      gradient: item.gradient,
      features: item.features || ['', '', ''],
      reverse: item.reverse,
      sort_order: item.sort_order || 0,
      is_active: item.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanFeatures = formData.features.filter(f => f.trim() !== '');
    if (cleanFeatures.length === 0) {
      alert('Please add at least one feature');
      return;
    }
    try {
      const dataToSend = { ...formData, features: cleanFeatures };
      if (editing) {
        await api.updateHomeShowcase(editing.id, dataToSend);
      } else {
        await api.createHomeShowcase(dataToSend);
      }
      setShowModal(false);
      loadShowcases();
    } catch (err) {
      alert('Failed to save showcase');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await api.deleteHomeShowcase(id);
      loadShowcases();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Home Showcases</h1>
          <p className="text-gray-500 mt-1">Zig-zag product showcase section</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
          <FiPlus size={20} /> Create Showcase
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Reverse</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sort</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {showcases.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No showcases found.</td></tr>
              ) : (
                showcases.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium"><div className="line-clamp-2">{item.title}</div></td>
                    <td className="px-6 py-4 text-sm font-mono text-xs">{item.icon}</td>
                    <td className="px-6 py-4 text-sm text-center">{item.reverse ? '✓' : '—'}</td>
                    <td className="px-6 py-4 text-sm text-center">{item.sort_order || 0}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(item)} className="text-brand-600 hover:text-brand-700 mr-3"><FiEdit2 size={18} /></button>
                      <button onClick={() => handleDelete(item.id, item.title)} className="text-red-600 hover:text-red-700"><FiTrash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editing ? 'Edit Showcase' : 'Create Showcase'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows="4" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name *</label>
                  <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" required placeholder="FiCheckCircle" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gradient *</label>
                  <input type="text" value={formData.gradient} onChange={(e) => setFormData({ ...formData, gradient: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" required placeholder="from-blue-500 to-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features *</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" value={feature} onChange={(e) => updateFeature(index, e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" placeholder={`Feature ${index + 1}`} />
                    {formData.features.length > 1 && (
                      <button type="button" onClick={() => removeFeature(index)} className="px-3 py-2 text-red-600 hover:text-red-700"><FiX size={20} /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addFeature} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  <FiPlus size={16} /> Add Feature
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" min="0" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.reverse} onChange={(e) => setFormData({ ...formData, reverse: e.target.checked })} className="w-4 h-4 text-brand-600 rounded" />
                    <span className="text-sm">Reverse Layout</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-brand-600 rounded" />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-white bg-brand-600 rounded-lg hover:bg-brand-700">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
