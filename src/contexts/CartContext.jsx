import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, bundle: null, bundle_savings: 0 });
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!user) { setCart({ items: [], subtotal: 0, bundle: null, bundle_savings: 0 }); setCartCount(0); return; }
    try {
      const data = await api.getCart();
      setCart(data);
      setCartCount(data.items?.length || 0);
    } catch { /* ignore */ }
  }, [user]);

  const addToCart = async (productId) => {
    await api.addToCart(productId);
    await refreshCart();
  };

  const removeFromCart = async (productId) => {
    await api.removeFromCart(productId);
    await refreshCart();
  };

  const clearCart = async () => {
    await api.clearCart();
    await refreshCart();
  };

  const addBundle = async (bundleId) => {
    await api.addBundleToCart(bundleId);
    await refreshCart();
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, refreshCart, addToCart, removeFromCart, clearCart, addBundle }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
