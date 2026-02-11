import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FiDownload, FiPackage } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getDashboard()
      .then(data => {
        console.log('Dashboard data:', data);
        console.log('Orders:', data?.orders);
        console.log('Orders data:', data?.orders?.data);
        console.log('First order full:', JSON.stringify(data?.orders?.data?.[0], null, 2));
        setData(data);
      })
      .catch(err => {
        console.error('Dashboard error:', err);
      });
  }, []);

  const handleDownload = async (productId) => {
    try {
      await api.downloadProduct(productId);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.first_name}!</p>

      <div className="bg-white rounded-xl border">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><FiPackage /> My Purchases</h2>
        </div>

        {data?.orders?.data?.length > 0 ? (
          <div className="divide-y">
            {data.orders.data.map((order) => (
              <div key={order.id} className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Order #{order.id} — {new Date(order.paid_at).toLocaleDateString()}</span>
                  <span className="text-sm font-medium text-gray-900">${parseFloat(order.total).toFixed(2)}</span>
                </div>
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <Link to={`/products/${item.product.slug}`} className="text-gray-700 hover:text-brand-600 font-medium text-sm">
                      {item.product.title}
                    </Link>
                    <button onClick={() => handleDownload(item.product.id)}
                      className="flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-medium">
                      <FiDownload size={14} /> Download
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">You haven't purchased anything yet.</p>
            <Link to="/products" className="text-brand-600 hover:text-brand-700 font-medium">Browse products</Link>
          </div>
        )}
      </div>
    </div>
  );
}
