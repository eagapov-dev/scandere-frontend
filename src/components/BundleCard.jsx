import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function BundleCard({ bundle, compact = false }) {
  const { user } = useAuth();
  const { addBundle } = useCart();

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { window.location.href = '/login'; return; }
    try { await addBundle(bundle.id); } catch (err) { alert(err.message || 'Failed to add.'); }
  };

  const originalPrice = bundle.products?.reduce((sum, p) => sum + parseFloat(p.price), 0) || parseFloat(bundle.original_price || 0);
  const currentPrice = parseFloat(bundle.price);
  const savings = originalPrice - currentPrice;
  const discountPercent = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  return (
    <div className="group bg-white rounded-xl border hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
      {/* Preview */}
      <div className="relative bg-gradient-to-br from-orange-50 to-red-50 p-8 flex items-center justify-center">
        <FiPackage size={compact ? 36 : 48} className="text-orange-400 group-hover:text-orange-500 transition" />
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded bg-gradient-to-r from-red-600 to-orange-600 text-white">
            SAVE {discountPercent}%
          </span>
        )}
        <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700">
          BUNDLE
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Bundle Deal</span>
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition leading-snug">
          {bundle.title}
        </h3>
        {!compact && bundle.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{bundle.description}</p>
        )}

        {/* Products included */}
        {bundle.products && bundle.products.length > 0 && (
          <div className="text-xs text-gray-500 mb-4">
            Includes {bundle.products.length} products
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t">
          <div className="flex flex-col">
            {discountPercent > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">
              ${currentPrice.toFixed(2)}
            </span>
            {savings > 0 && (
              <span className="text-xs text-green-600 font-medium">
                Save ${savings.toFixed(2)}
              </span>
            )}
          </div>
          <button onClick={handleAdd}
            className="flex items-center gap-1 bg-orange-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-orange-700 transition">
            <FiShoppingCart size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
