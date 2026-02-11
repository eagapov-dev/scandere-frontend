import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiMail, FiCheck } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.getAdminMessages();
      setMessages(response.data || []);
      setPagination(response);
    } catch (err) {
      console.error('Failed to load messages:', err);
      alert('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markMessageRead(id);
      loadMessages();
    } catch (err) {
      console.error('Failed to mark message as read:', err);
      alert('Failed to mark message as read');
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;
  const readCount = messages.filter(m => m.is_read).length;

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-500 mt-1">Messages from contact form submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiMail className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Read Messages</p>
              <p className="text-3xl font-bold text-gray-900">{readCount}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <FiCheck className="text-gray-600" size={24} />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  messages.map((message) => (
                    <tr
                      key={message.id}
                      className={`hover:bg-gray-50 ${!message.is_read ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-gray-900">
                          {message.first_name} {message.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <a
                          href={`mailto:${message.email}`}
                          className="text-brand-600 hover:text-brand-700 hover:underline"
                        >
                          {message.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="max-w-md">
                          {message.message.length > 100
                            ? `${message.message.substring(0, 100)}...`
                            : message.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          message.is_read
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {message.is_read ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(message.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        {!message.is_read && (
                          <button
                            onClick={() => handleMarkRead(message.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                          >
                            <FiCheck size={14} />
                            Mark as Read
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination?.last_page > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {pagination.from} to {pagination.to} of {pagination.total} messages
              </p>
              <div className="flex gap-2">
                {pagination.current_page > 1 && (
                  <button
                    onClick={() => loadMessages(pagination.current_page - 1)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                {pagination.current_page < pagination.last_page && (
                  <button
                    onClick={() => loadMessages(pagination.current_page + 1)}
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
