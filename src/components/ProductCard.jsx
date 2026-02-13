import { Link } from 'react-router-dom';
import { FiFileText, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function ProductCard({ product, compact = false }) {
  const { user, purchasedProductIds } = useAuth();
  const { addToCart } = useCart();

  const isPurchased = purchasedProductIds.includes(product.id);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { window.location.href = '/login'; return; }
    try { await addToCart(product.id); } catch (err) { alert(err.message || 'Failed to add.'); }
  };

  const typeColors = { pdf: 'bg-red-100 text-red-700', xlsx: 'bg-green-100 text-green-700', docx: 'bg-blue-100 text-blue-700' };
  const typeColor = typeColors[product.file_type] || 'bg-gray-100 text-gray-700';

  const hasDiscount = product.original_price && parseFloat(product.original_price) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100)
    : 0;

  return (
    <Link to={`/products/${product.slug}`}
      className="group bg-white rounded-xl border hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
      {/* Preview */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {product.preview_image ? (
          <img
            src={`http://localhost:8000/storage/${product.preview_image.replace('public/', '')}`}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="p-8">
            <FiFileText size={compact ? 36 : 48} className="text-gray-300 group-hover:text-brand-400 transition" />
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded bg-gradient-to-r from-red-600 to-orange-600 text-white">
            SAVE {discountPercent}%
          </span>
        )}
        {product.file_type && (
          <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded ${typeColor}`}>
            {product.file_type.toUpperCase()}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {product.category && (
          <span className="text-xs font-medium text-brand-600 uppercase tracking-wide mb-1">{product.category.name}</span>
        )}
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition leading-snug">
          {product.title}
        </h3>
        {!compact && product.short_description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{product.short_description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t">
          <div className="flex flex-col">
            {product.is_free ? (
              <span className="text-lg font-bold text-green-600">Free</span>
            ) : (
              <>
                {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                  <span className="text-xs text-gray-400 line-through">
                    ${parseFloat(product.original_price).toFixed(2)}
                  </span>
                )}
                <span className="text-lg font-bold text-gray-900">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>
          {isPurchased ? (
            <div className="flex items-center gap-1 bg-green-100 text-green-700 text-sm px-3 py-1.5 rounded-lg font-medium">
              <FiCheck size={14} />
              <span>Purchased</span>
            </div>
          ) : (
            <button onClick={handleAdd}
              className="flex items-center gap-1 bg-brand-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-brand-700 transition">
              <FiShoppingCart size={14} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
