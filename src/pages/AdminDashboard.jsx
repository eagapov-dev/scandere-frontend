import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.getAdminStats().then(setStats).catch(() => {}); }, []);

  if (!stats) return <AdminLayout><div className="text-center py-16 text-gray-400">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Revenue', value: `$${stats.total_revenue.toFixed(2)}` },
          { label: 'Orders', value: stats.total_orders },
          { label: 'Subscribers', value: stats.total_subscribers },
          { label: 'Users', value: stats.total_users },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b"><h2 className="font-semibold">Recent Orders</h2></div>
          <div className="divide-y">
            {stats.recent_orders.map((o) => (
              <div key={o.id} className="p-4 flex justify-between text-sm">
                <span>{o.user.first_name} {o.user.last_name}</span>
                <span className="font-medium">${parseFloat(o.total).toFixed(2)}</span>
              </div>
            ))}
            {!stats.recent_orders.length && <p className="p-4 text-gray-400 text-sm">No orders yet.</p>}
          </div>
        </div>
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b"><h2 className="font-semibold">Recent Subscribers</h2></div>
          <div className="divide-y">
            {stats.recent_subscribers.map((s) => (
              <div key={s.id} className="p-4 flex justify-between text-sm">
                <span>{s.email}</span>
                <span className="text-gray-400">{s.source}</span>
              </div>
            ))}
            {!stats.recent_subscribers.length && <p className="p-4 text-gray-400 text-sm">No subscribers yet.</p>}
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}
