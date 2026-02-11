import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [purchasedProductIds, setPurchasedProductIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (api.getToken()) {
      api.getUser().then(setUser).catch(() => api.clearToken()).finally(() => setLoading(false));

      // Load purchased product IDs
      api.getDashboard()
        .then(data => setPurchasedProductIds(data.purchased_product_ids || []))
        .catch(() => {});
    } else { setLoading(false); }
  }, []);

  const login = async (email, password) => {
    const d = await api.login(email, password);
    setUser(d.user);
    // Load purchased products after login
    api.getDashboard()
      .then(data => setPurchasedProductIds(data.purchased_product_ids || []))
      .catch(() => {});
    return d;
  };

  const register = async (data) => {
    const d = await api.register(data);
    setUser(d.user);
    return d;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setPurchasedProductIds([]);
  };

  return <AuthContext.Provider value={{ user, purchasedProductIds, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
