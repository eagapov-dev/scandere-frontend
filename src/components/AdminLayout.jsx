import { Link, useLocation } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/bundles', label: 'Bundles' },
    { path: '/admin/categories', label: 'Categories' },
    { path: '/admin/faqs', label: 'FAQs' },
    { path: '/admin/hero-slides', label: 'Hero Slides' },
    { path: '/admin/home-features', label: 'Features' },
    { path: '/admin/home-stats', label: 'Stats' },
    { path: '/admin/home-showcases', label: 'Showcases' },
    { path: '/admin/social-links', label: 'Social Links' },
    { path: '/admin/navigation-links', label: 'Nav Links' },
    { path: '/admin/subscribers', label: 'Subscribers' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/newsletter', label: 'Newsletter' },
    { path: '/admin/orders', label: 'Orders' },
    { path: '/admin/comments', label: 'Comments' },
    { path: '/admin/messages', label: 'Messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex-shrink-0">
        <div className="p-6 border-b flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Scandere Admin
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t mt-4">
          <Link to="/" className="block px-4 py-2.5 text-sm text-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            ← Back to Site
          </Link>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
