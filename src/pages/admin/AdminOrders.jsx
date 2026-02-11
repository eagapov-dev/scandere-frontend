import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiDollarSign, FiShoppingBag, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

export default function AdminOrders() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.getAdminOrders();
      setData(response);
    } catch (err) {
      console.error('Failed to load orders:', err);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const stats = {
    total_revenue: data?.total_revenue || 0,
    total_orders: data?.total_orders || 0
  };
  const orders = data?.orders?.data || [];

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">All customer orders and purchases</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ${parseFloat(stats.total_revenue).toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiDollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_orders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiShoppingBag className="text-blue-600" size={24} />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <>
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {order.user.first_name} {order.user.last_name}
                            </div>
                            <div className="text-gray-500 text-xs">{order.user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ${parseFloat(order.total).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.payment_method === 'free' ? 'Free' : 'Stripe'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.paid_at ? new Date(order.paid_at).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleOrder(order.id)}
                            className="text-brand-600 hover:text-brand-700"
                          >
                            {expandedOrders.has(order.id) ? (
                              <FiChevronUp size={20} />
                            ) : (
                              <FiChevronDown size={20} />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row - Order Items */}
                      {expandedOrders.has(order.id) && (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 bg-gray-50">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900 mb-3">Order Items:</h4>
                              {order.items?.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between py-2 px-4 bg-white rounded border"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.product.title}</p>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900">
                                      ${parseFloat(item.price).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Subtotal: ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.last_page > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {data.from} to {data.to} of {data.total} orders
              </p>
              <div className="flex gap-2">
                {data.current_page > 1 && (
                  <button
                    onClick={() => loadOrders(data.current_page - 1)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                {data.current_page < data.last_page && (
                  <button
                    onClick={() => loadOrders(data.current_page + 1)}
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
