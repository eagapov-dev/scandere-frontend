import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';
import { FiTrash2, FiShoppingCart, FiPackage } from 'react-icons/fi';

export default function Cart() {
  const { cart, refreshCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const handleCheckout = async () => {
    try {
      const data = await api.checkout();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        // Free order or payment bypassed - completed immediately
        alert(data.message || 'Order completed!');
        await refreshCart();
        navigate('/dashboard');
      }
    } catch (err) { alert(err.message || 'Checkout failed.'); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <FiShoppingCart /> Your Cart
      </h1>

      {cart.items?.length > 0 ? (
        <>
          <div className="bg-white rounded-xl border divide-y mb-6">
            {cart.items.map((item) => (
              <div key={item.id} className="p-5 flex items-center justify-between">
                <div className="flex-1">
                  <Link to={`/products/${item.product.slug}`} className="font-medium text-gray-900 hover:text-brand-600">
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {item.product.is_free ? 'Free' : `$${parseFloat(item.product.price).toFixed(2)}`}
                  </p>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-500 p-2">
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Bundle savings */}
          {cart.bundle && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <FiPackage className="text-green-600" size={20} />
              <div>
                <p className="text-green-800 font-medium">{cart.bundle.title} applied!</p>
                <p className="text-green-600 text-sm">You save ${cart.bundle_savings.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">${cart.subtotal.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout}
              className="w-full bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 font-semibold text-lg mb-3">
              Proceed to Checkout
            </button>
            <div className="flex justify-between">
              <Link to="/products" className="text-sm text-brand-600 hover:text-brand-700">Continue shopping</Link>
              <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500">Clear cart</button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border">
          <FiShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/products" className="text-brand-600 hover:text-brand-700 font-medium">Browse products</Link>
        </div>
      )}
    </div>
  );
}
