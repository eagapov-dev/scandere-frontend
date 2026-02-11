import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

export default function AdminHomeStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ value: '', label: '', sort_order: 0, is_active: true });

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminHomeStats();
      setStats(data || []);
    } catch (err) {
      alert('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setFormData({ value: '', label: '', sort_order: 0, is_active: true });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({ value: item.value, label: item.label, sort_order: item.sort_order || 0, is_active: item.is_active });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateHomeStat(editing.id, formData);
      } else {
        await api.createHomeStat(formData);
      }
      setShowModal(false);
      loadStats();
    } catch (err) {
      alert('Failed to save stat');
    }
  };

  const handleDelete = async (id, label) => {
    if (!confirm(`Delete "${label}"?`)) return;
    try {
      await api.deleteHomeStat(id);
      loadStats();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Home Stats</h1>
          <p className="text-gray-500 mt-1">Statistics section at bottom of homepage</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
          <FiPlus size={20} /> Create Stat
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sort</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No stats found.</td></tr>
              ) : (
                stats.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-bold text-brand-600">{item.value}</td>
                    <td className="px-6 py-4 text-sm">{item.label}</td>
                    <td className="px-6 py-4 text-sm text-center">{item.sort_order || 0}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(item)} className="text-brand-600 hover:text-brand-700 mr-3"><FiEdit2 size={18} /></button>
                      <button onClick={() => handleDelete(item.id, item.label)} className="text-red-600 hover:text-red-700"><FiTrash2 size={18} /></button>
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
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editing ? 'Edit Stat' : 'Create Stat'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                <input type="text" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required placeholder="1000+" />
                <p className="text-xs text-gray-500 mt-1">e.g., 1000+, 4.9/5, 24/7</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                <input type="text" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required placeholder="Happy Customers" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input type="number" min="0" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-brand-600 rounded" />
                  <span className="text-sm">Active</span>
                </label>
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
