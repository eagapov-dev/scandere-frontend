import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

// Lazy-loaded routes
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const FAQ = lazy(() => import('./pages/FAQ'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminBundles = lazy(() => import('./pages/admin/AdminBundles'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminFaqs = lazy(() => import('./pages/admin/AdminFaqs'));
const AdminFaqCategories = lazy(() => import('./pages/admin/AdminFaqCategories'));
const AdminHeroSlides = lazy(() => import('./pages/admin/AdminHeroSlides'));
const AdminHomeFeatures = lazy(() => import('./pages/admin/AdminHomeFeatures'));
const AdminHomeStats = lazy(() => import('./pages/admin/AdminHomeStats'));
const AdminHomeShowcases = lazy(() => import('./pages/admin/AdminHomeShowcases'));
const AdminSocialLinks = lazy(() => import('./pages/admin/AdminSocialLinks'));
const AdminNavigationLinks = lazy(() => import('./pages/admin/AdminNavigationLinks'));
const AdminSubscribers = lazy(() => import('./pages/admin/AdminSubscribers'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminComments = lazy(() => import('./pages/admin/AdminComments'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    </div>
  );
}

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
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
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
              <Route path="/admin/users" element={<ProtectedRoute admin><AdminUsers /></ProtectedRoute>} />
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
          </Suspense>
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
