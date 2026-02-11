import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import { FiShoppingCart, FiDownload, FiFileText, FiMessageCircle, FiUser } from 'react-icons/fi';

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reload = () => api.getProduct(slug).then(setData).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { setLoading(true); reload(); }, [slug]);

  const handleAddToCart = async () => {
    if (!user) { window.location.href = '/login'; return; }
    try { await addToCart(data.product.id); } catch (err) { alert(err.message || 'Failed.'); }
  };

  const handleDownload = async () => {
    try {
      const res = await api.downloadProduct(data.product.id);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = data.product.file_name || 'file'; a.click();
      window.URL.revokeObjectURL(url);
    } catch { alert('Download failed.'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try { await api.postComment(data.product.id, comment); setComment(''); reload(); }
    catch { alert('Failed to post comment.'); }
    setSubmitting(false);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!data) return <div className="text-center py-20 text-gray-400">Product not found.</div>;

  const { product, has_purchased, comments, related } = data;
  const typeColors = { pdf: 'bg-red-100 text-red-700', xlsx: 'bg-green-100 text-green-700', docx: 'bg-blue-100 text-blue-700' };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link to="/products" className="text-brand-600 hover:text-brand-700 text-sm mb-6 inline-block">&larr; Back to products</Link>

      {/* Product Detail */}
      <div className="bg-white rounded-xl border p-6 md:p-8 mb-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/5">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 flex flex-col items-center justify-center aspect-[4/3]">
              <FiFileText size={64} className="text-gray-300 mb-4" />
              {product.file_type && (
                <span className={`text-sm font-bold px-3 py-1 rounded ${typeColors[product.file_type] || 'bg-gray-100 text-gray-700'}`}>
                  {product.file_type.toUpperCase()} Document
                </span>
              )}
            </div>
          </div>
          <div className="md:w-3/5">
            {product.category && <span className="text-sm font-medium text-brand-600 uppercase tracking-wide">{product.category.name}</span>}
            <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3">{product.title}</h1>
            <p className="text-gray-500 text-sm mb-4">{product.download_count} downloads</p>

            <div className={`text-3xl font-bold mb-6 ${product.is_free ? 'text-green-600' : 'text-gray-900'}`}>
              {product.is_free ? 'Free' : `$${parseFloat(product.price).toFixed(2)}`}
            </div>

            {product.description && (
              <div className="text-gray-600 mb-8 whitespace-pre-line leading-relaxed">{product.description}</div>
            )}

            {user ? (
              has_purchased || product.is_free ? (
                <button onClick={handleDownload}
                  className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium text-lg">
                  <FiDownload /> Download Now
                </button>
              ) : (
                <button onClick={handleAddToCart}
                  className="flex items-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-lg hover:bg-brand-700 font-medium text-lg">
                  <FiShoppingCart /> Add to Cart — ${parseFloat(product.price).toFixed(2)}
                </button>
              )
            ) : (
              <div className="bg-gray-50 rounded-lg p-5">
                <p className="text-gray-700 mb-3">Sign in to purchase and download this product.</p>
                <div className="flex gap-3">
                  <Link to="/login" className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 font-medium">Sign In</Link>
                  <Link to="/register" className="bg-white text-brand-600 border border-brand-600 px-6 py-2 rounded-lg hover:bg-brand-50 font-medium">Sign Up</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ / Q&A Section - Auto-generated from user comments */}
      <div className="bg-white rounded-xl border p-6 md:p-8 mb-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FiMessageCircle /> Questions & Answers (FAQ)
          </h2>
          <p className="text-gray-600 text-sm">
            Real questions from customers like you. Have a question? Ask below and get answers from our community!
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mt-2">
            {comments?.length || 0} {comments?.length === 1 ? 'Question' : 'Questions'} Asked
          </div>
        </div>

        {/* Post question form */}
        {user ? (
          <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-6 mb-8 border-2 border-brand-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiMessageCircle className="text-brand-600" />
              Ask a Question
            </h3>
            <form onSubmit={handleComment}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                required
                placeholder="What would you like to know about this product? Other customers or our team will help answer..."
                className="w-full px-4 py-3 border border-brand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none mb-3 bg-white"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 font-semibold text-sm disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
              >
                {submitting ? 'Posting Question...' : 'Post Question'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border-2 border-gray-200 text-center">
            <p className="text-gray-700 mb-3">
              Have a question about this product?
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 font-semibold transition-all"
            >
              Sign In to Ask a Question
            </Link>
          </div>
        )}

        {/* Q&A List - FAQ Style */}
        {comments?.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Customer Questions & Answers</h3>
            {comments.map((c, idx) => (
              <div
                key={c.id}
                className="bg-gray-50 rounded-xl p-5 border-l-4 border-brand-500 hover:shadow-md transition-shadow"
              >
                {/* Question */}
                <div className="mb-3">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-xs">Q</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{c.user.first_name} {c.user.last_name}</span>
                        <span className="text-xs text-gray-500">
                          asked on {new Date(c.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-800 leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                </div>

                {/* Answer section */}
                {c.answer ? (
                  <div className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-200">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-xs">A</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">Scandere AI Team</span>
                        <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full">
                          Official Answer
                        </span>
                      </div>
                      <p className="text-gray-800 leading-relaxed">{c.answer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-400 text-sm italic">
                      Awaiting answer from our team...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <FiMessageCircle size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-2">No questions yet</p>
            <p className="text-gray-500 text-sm">Be the first to ask a question about this product!</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => <ProductCard key={r.id} product={r} compact />)}
          </div>
        </div>
      )}
    </div>
  );
}
