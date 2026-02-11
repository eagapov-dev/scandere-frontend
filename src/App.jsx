import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBundles from './pages/admin/AdminBundles';
import AdminCategories from './pages/admin/AdminCategories';
import AdminFaqs from './pages/admin/AdminFaqs';
import AdminFaqCategories from './pages/admin/AdminFaqCategories';
import AdminHeroSlides from './pages/admin/AdminHeroSlides';
import AdminHomeFeatures from './pages/admin/AdminHomeFeatures';
import AdminHomeStats from './pages/admin/AdminHomeStats';
import AdminHomeShowcases from './pages/admin/AdminHomeShowcases';
import AdminSocialLinks from './pages/admin/AdminSocialLinks';
import AdminNavigationLinks from './pages/admin/AdminNavigationLinks';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminComments from './pages/admin/AdminComments';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import FAQ from './pages/FAQ';

function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (admin && !user.is_admin) return <Navigate to="/dashboard" />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

function AppContent() {
  return (
    <CartProvider>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute admin><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/bundles" element={<ProtectedRoute admin><AdminBundles /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute admin><AdminCategories /></ProtectedRoute>} />
            <Route path="/admin/faqs" element={<ProtectedRoute admin><AdminFaqs /></ProtectedRoute>} />
            <Route path="/admin/faq-categories" element={<ProtectedRoute admin><AdminFaqCategories /></ProtectedRoute>} />
            <Route path="/admin/hero-slides" element={<ProtectedRoute admin><AdminHeroSlides /></ProtectedRoute>} />
            <Route path="/admin/home-features" element={<ProtectedRoute admin><AdminHomeFeatures /></ProtectedRoute>} />
            <Route path="/admin/home-stats" element={<ProtectedRoute admin><AdminHomeStats /></ProtectedRoute>} />
            <Route path="/admin/home-showcases" element={<ProtectedRoute admin><AdminHomeShowcases /></ProtectedRoute>} />
            <Route path="/admin/social-links" element={<ProtectedRoute admin><AdminSocialLinks /></ProtectedRoute>} />
            <Route path="/admin/navigation-links" element={<ProtectedRoute admin><AdminNavigationLinks /></ProtectedRoute>} />
            <Route path="/admin/subscribers" element={<ProtectedRoute admin><AdminSubscribers /></ProtectedRoute>} />
            <Route path="/admin/newsletter" element={<ProtectedRoute admin><AdminNewsletter /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute admin><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/comments" element={<ProtectedRoute admin><AdminComments /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute admin><AdminMessages /></ProtectedRoute>} />
            {/* Static pages - placeholder */}
            <Route path="/about" element={<StaticPage title="About Us" />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<StaticPage title="Help Center" />} />
            <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
            <Route path="/terms" element={<StaticPage title="Terms & Conditions" />} />
            <Route path="/refund" element={<StaticPage title="Refund Policy" />} />
            <Route path="/returns" element={<StaticPage title="Returns Policy" />} />
            <Route path="*" element={<div className="text-center py-20"><h1 className="text-2xl font-bold text-gray-400">404 — Page not found</h1></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

function StaticPage({ title }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="bg-white rounded-xl border p-8">
        <p className="text-gray-500">This page is under construction. Content coming soon.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
