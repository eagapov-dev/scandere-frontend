import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiEdit2, FiTrash2, FiMessageSquare, FiHome, FiCheck, FiX } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [formData, setFormData] = useState({
    body: '',
    answer: '',
    status: 'draft',
    show_on_homepage: false
  });

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.getAdminComments();
      setComments(response.data || []);
      setPagination(response);
    } catch (err) {
      console.error('Failed to load comments:', err);
      alert('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setFormData({
      body: comment.body,
      answer: comment.answer || '',
      status: comment.status,
      show_on_homepage: comment.show_on_homepage || false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateComment(editingComment.id, formData);
      setShowModal(false);
      setEditingComment(null);
      loadComments();
    } catch (err) {
      console.error('Failed to update comment:', err);
      alert('Failed to update comment');
    }
  };

  const handleDelete = async (id, userName) => {
    if (!confirm(`Are you sure you want to delete comment by ${userName}?`)) return;

    try {
      await api.deleteComment(id);
      loadComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment');
    }
  };

  const draftCount = comments.filter(c => c.status === 'draft').length;
  const publishedCount = comments.filter(c => c.status === 'published').length;

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Comment Moderation</h1>
        <p className="text-gray-500 mt-1">Review, edit, and answer customer questions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Draft (Hidden)</p>
              <p className="text-3xl font-bold text-gray-900">{draftCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiMessageSquare className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Published (Visible)</p>
              <p className="text-3xl font-bold text-gray-900">{publishedCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiMessageSquare className="text-green-600" size={24} />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Homepage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {comments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">
                      No comments found.
                    </td>
                  </tr>
                ) : (
                  comments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-gray-900">
                          {comment.user.first_name} {comment.user.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="max-w-xs">
                          {comment.product ? (
                            <>
                              <div className="font-medium text-gray-900 truncate">
                                {comment.product.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {comment.product.id}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-500 italic text-xs">
                              General Question
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="max-w-md">
                          {comment.body.length > 100
                            ? `${comment.body.substring(0, 100)}...`
                            : comment.body}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="max-w-md">
                          {comment.answer ? (
                            comment.answer.length > 80
                              ? `${comment.answer.substring(0, 80)}...`
                              : comment.answer
                          ) : (
                            <span className="text-gray-400 italic">No answer</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          comment.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comment.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {comment.show_on_homepage ? (
                          <div className="inline-flex items-center gap-1 text-brand-600">
                            <FiHome size={18} />
                            <FiCheck size={14} />
                          </div>
                        ) : (
                          <FiX className="text-gray-300 mx-auto" size={18} />
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(comment)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id, `${comment.user.first_name} ${comment.user.last_name}`)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                            Delete
                          </button>
                        </div>
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
                Showing {pagination.from} to {pagination.to} of {pagination.total} comments
              </p>
              <div className="flex gap-2">
                {pagination.current_page > 1 && (
                  <button
                    onClick={() => loadComments(pagination.current_page - 1)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                {pagination.current_page < pagination.last_page && (
                  <button
                    onClick={() => loadComments(pagination.current_page + 1)}
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

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Edit Comment</h2>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Product:</span>{' '}
                  {editingComment?.product?.title || (
                    <span className="italic text-gray-500">General Question</span>
                  )}
                </div>
                <div>
                  <span className="font-medium">Asked by:</span> {editingComment?.user?.first_name} {editingComment?.user?.last_name}
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              {/* User question */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Question
                </label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({...formData, body: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can edit the question to improve clarity or fix typos
                </p>
              </div>

              {/* Admin answer */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add your answer here..."
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be displayed publicly as "Official Answer"
                </p>
              </div>

              {/* Status dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft (Hidden from customers)</option>
                  <option value="published">Published (Visible on product page)</option>
                </select>
              </div>

              {/* Show on homepage checkbox */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.show_on_homepage}
                    onChange={(e) => setFormData({...formData, show_on_homepage: e.target.checked})}
                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Show on Homepage
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Display this Q&A in the featured questions section on the homepage
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingComment(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
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
