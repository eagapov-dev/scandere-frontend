import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiDownload, FiMail } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

export default function AdminSubscribers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.getAdminSubscribers();
      setData(response);
    } catch (err) {
      console.error('Failed to load subscribers:', err);
      alert('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.exportSubscribers();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export subscribers');
    }
  };

  const stats = data?.stats || { total_active: 0, total_unsubscribed: 0 };
  const subscribers = data?.data || [];

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-gray-500 mt-1">Newsletter subscription management</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          <FiDownload size={18} />
          Export CSV
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Subscribers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_active}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiMail className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Unsubscribed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_unsubscribed}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <FiMail className="text-gray-600" size={24} />
            </div>
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed At</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{sub.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {sub.first_name ? `${sub.first_name} ${sub.last_name || ''}`.trim() : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{sub.source || 'Direct'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          sub.unsubscribed_at
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {sub.unsubscribed_at ? 'Unsubscribed' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(sub.subscribed_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.last_page > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {data.from} to {data.to} of {data.total} subscribers
              </p>
              <div className="flex gap-2">
                {data.current_page > 1 && (
                  <button
                    onClick={() => loadSubscribers(data.current_page - 1)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                {data.current_page < data.last_page && (
                  <button
                    onClick={() => loadSubscribers(data.current_page + 1)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
