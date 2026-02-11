import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import {
  FiCheckCircle, FiDownload, FiShield, FiCreditCard, FiArrowRight, FiPackage,
  FiZap, FiTrendingUp, FiAward, FiUsers, FiFileText, FiTarget, FiDollarSign,
  FiClock, FiStar, FiLock, FiShoppingCart, FiMessageCircle, FiCheck
} from 'react-icons/fi';

// Icon mapping for dynamic loading
const iconMap = {
  FiTrendingUp, FiPackage, FiDownload, FiAward, FiZap, FiLock, FiStar, FiClock,
  FiCheckCircle, FiCreditCard, FiTarget
};

// Map Tailwind gradient classes to CSS gradient values
const gradientMap = {
  'from-brand-700 via-brand-800 to-brand-900': 'linear-gradient(to bottom right, #146fe1, #175ab6, #194d8f)',
  'from-emerald-600 via-emerald-700 to-emerald-900': 'linear-gradient(to bottom right, #059669, #047857, #064e3b)',
  'from-violet-600 via-violet-700 to-violet-900': 'linear-gradient(to bottom right, #7c3aed, #6d28d9, #4c1d95)',
  'from-orange-600 via-orange-700 to-orange-900': 'linear-gradient(to bottom right, #ea580c, #c2410c, #7c2d12)',
  'from-blue-500 to-cyan-500': 'linear-gradient(to bottom right, #3b82f6, #06b6d4)',
  'from-green-500 to-emerald-500': 'linear-gradient(to bottom right, #22c55e, #10b981)',
  'from-purple-500 to-pink-500': 'linear-gradient(to bottom right, #a855f7, #ec4899)',
};

export default function Home() {
  const [featured, setFeatured] = useState({ products: [], bundles: [] });
  const [recentQA, setRecentQA] = useState([]);
  const [homeContent, setHomeContent] = useState({
    hero_slides: [],
    features: [],
    stats: [],
    showcases: [],
    social_links: []
  });
  const [slide, setSlide] = useState(0);
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, purchasedProductIds } = useAuth();
  const { addBundle, addToCart } = useCart();

  useEffect(() => {
    api.getFeatured()
      .then(setFeatured)
      .catch(err => {
        console.error('Failed to load featured products:', err);
      });

    api.getRecentQA(6)
      .then(setRecentQA)
      .catch(err => {
        console.error('Failed to load recent Q&A:', err);
      });

    api.getHomeContent()
      .then(setHomeContent)
      .catch(err => {
        console.error('Failed to load home content:', err);
      });
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (homeContent.hero_slides.length > 0) {
      const timer = setInterval(() => setSlide((s) => (s + 1) % homeContent.hero_slides.length), 5000);
      return () => clearInterval(timer);
    }
  }, [homeContent.hero_slides.length]);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (!question.trim()) return;

    try {
      setSubmitting(true);
      await api.postGeneralQuestion(question);
      setQuestion('');
      alert('Your question has been submitted! We\'ll answer it soon.');
    } catch (err) {
      console.error('Failed to submit question:', err);
      alert('Failed to submit question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayProducts = featured.products || [];
  const bundles = featured.bundles || [];

  return (
    <>
      {/* HERO CAROUSEL BANNER with Swiper */}
      <section className="relative overflow-hidden hero-section">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={{
            enabled: true,
            hideOnClick: false,
          }}
          loop
          className="hero-swiper"
        >
          {homeContent.hero_slides.map((slide, i) => {
            const IconComponent = iconMap[slide.icon] || FiPackage;
            return (
            <SwiperSlide key={slide.id || i}>
              <div className="relative" style={{ background: gradientMap[slide.bg_gradient] || '#1b87f5' }}>
                <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="text-white z-10">
                      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <Link
                        to={slide.cta_link}
                        className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all text-lg shadow-xl hover:shadow-2xl hover:scale-105"
                      >
                        {slide.cta_text} <FiArrowRight />
                      </Link>
                    </div>

                    {/* Right: Large Icon Illustration */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
                        <IconComponent className="text-white/20 relative z-10" size={280} strokeWidth={0.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );})}
        </Swiper>
      </section>

      {/* BUNDLE DEALS SECTION */}
      {bundles.length > 0 && (
      <section className="bg-gradient-to-b from-orange-50 to-white py-12 md:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                <FiPackage size={14} /> BUNDLE DEALS
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Save Big with Bundle Deals</h2>
              <p className="text-sm md:text-base text-gray-600">Get multiple products together and save up to 30%!</p>
            </div>
          </div>

          {/* Bundle Cards */}
          <div className="space-y-6 md:space-y-8">
            {bundles.map((bundle) => (
            <div key={bundle.id} className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl"></div>

              <div className="relative z-10 p-5 sm:p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  {/* Left: Content */}
                  <div className="flex-1 text-white w-full">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4">
                      <FiPackage size={16} /> BUNDLE DEAL
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">
                      {bundle?.title || 'Bundle Deal'}
                    </h3>
                    <p className="text-white/90 text-base md:text-lg mb-4 md:mb-6">
                      Get all three essential products together and save big!
                    </p>

                    {/* Products list with individual prices */}
                    {bundle?.products && bundle.products.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                        <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                          {bundle.products.map((product) => (
                            <div key={product.id} className="flex items-center justify-between text-white gap-2">
                              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                                <FiCheckCircle className="text-green-300 flex-shrink-0" size={16} />
                                <span className="font-medium text-xs sm:text-sm md:text-base truncate">{product.title}</span>
                              </div>
                              <span className="font-bold text-sm md:text-lg flex-shrink-0">${parseFloat(product.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-white/20 pt-2 md:pt-3 flex items-center justify-between text-white">
                          <span className="font-semibold text-sm md:text-base">Regular Total:</span>
                          <span className="font-bold text-lg md:text-xl line-through opacity-70">
                            ${parseFloat(bundle.original_price || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Mobile: Pricing */}
                    <div className="md:hidden mb-4 md:mb-6">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                        <span className="text-white/60 line-through text-xl sm:text-2xl">
                          ${parseFloat(bundle?.original_price || 0).toFixed(2)}
                        </span>
                        <span className="text-4xl sm:text-5xl font-bold">${parseFloat(bundle?.price || 0).toFixed(2)}</span>
                        <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                          Save {bundle?.savings || '$0'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!user) {
                          window.location.href = '/login';
                        } else if (bundle?.id) {
                          addBundle(bundle.id);
                        }
                      }}
                      className="w-full sm:w-auto bg-white text-red-600 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg md:rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center justify-center gap-2 text-base md:text-lg"
                    >
                      <FiShoppingCart size={18} />
                      Get Bundle — Save {bundle?.savings}
                    </button>
                  </div>

                  {/* Right: Pricing (Desktop) */}
                  <div className="hidden md:block text-center text-white flex-shrink-0">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border-2 border-white/20">
                      <div className="text-white/70 line-through text-lg lg:text-xl mb-2">
                        ${parseFloat(bundle?.original_price || 0).toFixed(2)}
                      </div>
                      <div className="text-5xl lg:text-6xl font-bold mb-3 lg:mb-4">${parseFloat(bundle?.price || 0).toFixed(2)}</div>
                      <div className="bg-green-400 text-green-900 px-3 lg:px-4 py-2 rounded-full text-base lg:text-lg font-bold inline-block">
                        Save {bundle?.savings || '$0'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* FEATURED PRODUCTS SECTION */}
      {displayProducts.length > 0 && (
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                <FiStar size={14} /> FEATURED PRODUCTS
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Popular Products</h2>
              <p className="text-sm md:text-base text-gray-600">Our best-selling templates and resources</p>
            </div>
          </div>

          {/* Products: Grid if <=3, Swiper slider if >3 */}
          {displayProducts.length <= 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {displayProducts.map((product) => {
                const hasOriginalPrice = product.original_price && parseFloat(product.original_price) > parseFloat(product.price);
                const originalPrice = hasOriginalPrice ? parseFloat(product.original_price) : 0;
                const currentPrice = product.is_free ? 0 : parseFloat(product.price);
                const discount = hasOriginalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
                const isPurchased = purchasedProductIds.includes(product.id);

                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="group bg-white rounded-3xl border-2 border-gray-200 hover:border-brand-500 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col max-w-sm mx-auto w-full"
                  >
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                      {product.category && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700 uppercase tracking-wide">
                          {product.category.name}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-orange-600 text-white">
                          SAVE {discount}%
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FiFileText className="text-brand-600" size={40} />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-brand-600 transition">{product.title}</h3>
                      <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed flex-1">{product.short_description || 'Professional template to help you succeed in your business.'}</p>
                      <div className="text-center mb-4 pt-4 border-t">
                        {product.is_free ? (
                          <span className="text-3xl font-bold text-green-600">FREE</span>
                        ) : (
                          <>
                            {discount > 0 && <div className="text-sm text-gray-400 line-through mb-1">${originalPrice.toFixed(2)}</div>}
                            <div className="text-4xl font-bold text-gray-900">${currentPrice.toFixed(2)}</div>
                          </>
                        )}
                      </div>
                      {isPurchased ? (
                        <div className="w-full bg-green-100 text-green-700 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                          <FiCheck size={18} /> Purchased
                        </div>
                      ) : (
                        <button onClick={(e) => { e.preventDefault(); if (!user) { window.location.href = '/login'; } else { addToCart(product.id); } }} className="w-full bg-brand-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                          <FiShoppingCart size={18} /> Add to Cart
                        </button>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="products-swiper pb-12"
            >
              {displayProducts.map((product) => {
                const hasOriginalPrice = product.original_price && parseFloat(product.original_price) > parseFloat(product.price);
                const originalPrice = hasOriginalPrice ? parseFloat(product.original_price) : 0;
                const currentPrice = product.is_free ? 0 : parseFloat(product.price);
                const discount = hasOriginalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
                const isPurchased = purchasedProductIds.includes(product.id);

                return (
                  <SwiperSlide key={product.id} className="h-auto pb-2">
                    <Link
                      to={`/products/${product.slug}`}
                      className="group bg-white rounded-3xl border-2 border-gray-200 hover:border-brand-500 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                    >
                      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                        {product.category && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700 uppercase tracking-wide">
                            {product.category.name}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-orange-600 text-white">
                            SAVE {discount}%
                          </span>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center justify-center mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FiFileText className="text-brand-600" size={40} />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-brand-600 transition">{product.title}</h3>
                        <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed flex-1">{product.short_description || 'Professional template to help you succeed in your business.'}</p>
                        <div className="text-center mb-4 pt-4 border-t">
                          {product.is_free ? (
                            <span className="text-3xl font-bold text-green-600">FREE</span>
                          ) : (
                            <>
                              {discount > 0 && <div className="text-sm text-gray-400 line-through mb-1">${originalPrice.toFixed(2)}</div>}
                              <div className="text-4xl font-bold text-gray-900">${currentPrice.toFixed(2)}</div>
                            </>
                          )}
                        </div>
                        {isPurchased ? (
                          <div className="w-full bg-green-100 text-green-700 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                            <FiCheck size={18} /> Purchased
                          </div>
                        ) : (
                          <button onClick={(e) => { e.preventDefault(); if (!user) { window.location.href = '/login'; } else { addToCart(product.id); } }} className="w-full bg-brand-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                            <FiShoppingCart size={18} /> Add to Cart
                          </button>
                        )}
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
          </div>
        </section>
      )}

      {/* WHY CHOOSE US - Feature Tiles */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose Our Templates?</h2>
            <p className="text-gray-600">Everything you need to succeed, in one place</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeContent.features.map((feat, i) => {
              const IconComponent = iconMap[feat.icon] || FiStar;
              return (
              <div
                key={feat.id || i}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-brand-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="text-brand-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feat.description}</p>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* ZIG-ZAG SECTIONS - Product Showcase */}
      <section className="max-w-7xl mx-auto px-4 py-20 space-y-24">
        {homeContent.showcases.map((item, i) => {
          const IconComponent = iconMap[item.icon] || FiCheckCircle;
          return (
          <div
            key={item.id || i}
            className={`flex flex-col ${item.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-16`}
          >
            {/* Visual Side */}
            <div className="md:w-1/2">
              <div className="relative rounded-3xl p-16 shadow-2xl" style={{ background: gradientMap[item.gradient] || '#1b87f5' }}>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                {/* Icon */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
                    <IconComponent size={100} className="text-white" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Stats badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <FiStar className="text-yellow-500" />
                    <span className="text-sm font-bold text-gray-900">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase">
                Featured Product
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{item.title}</h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{item.description}</p>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                {item.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiCheckCircle className="text-green-600" size={14} />
                    </div>
                    <span className="text-gray-700">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
              >
                View Product <FiArrowRight />
              </Link>
            </div>
          </div>
        );})}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent -translate-y-1/2"></div>

            {[
              {
                n: '1',
                icon: FiUsers,
                t: 'Create an Account',
                d: 'Sign up for free in seconds. All you need is your name and email.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                n: '2',
                icon: FiCreditCard,
                t: 'Choose & Purchase',
                d: 'Browse our collection, add to cart, and pay securely with Stripe.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                n: '3',
                icon: FiDownload,
                t: 'Download Instantly',
                d: 'Access your purchased files immediately from your dashboard. Re-download anytime.',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((s) => (
              <div key={s.n} className="relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {s.n}
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: gradientMap[s.color] || '#1b87f5' }}>
                    <s.icon size={36} className="text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{s.t}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
            >
              Get Started Now <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CUSTOMER Q&A SECTION */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <FiMessageCircle size={18} />
              CUSTOMER QUESTIONS
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Questions? We've Got Answers
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              See what other entrepreneurs are asking, or submit your own question
            </p>
          </div>

          {/* Q&A Cards: Grid if <=3, Swiper slider if >3 */}
          {recentQA.length > 0 && (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Questions</h3>
              {recentQA.length <= 3 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentQA.map((qa) => (
                    <div key={qa.id} className="bg-white rounded-2xl border-2 border-gray-200 hover:border-brand-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                      {qa.product ? (
                        <div className="bg-brand-50 border-b border-brand-100 px-5 py-3">
                          <Link to={`/products/${qa.product.slug}`} className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors flex items-center gap-2">
                            <FiFileText size={14} /> {qa.product.title}
                          </Link>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
                          <div className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                            <FiMessageCircle size={14} /> General Question
                          </div>
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="mb-4">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white font-bold text-xs">Q</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 text-sm">{qa.user.first_name} {qa.user.last_name}</span>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{qa.body.length > 120 ? `${qa.body.substring(0, 120)}...` : qa.body}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                            <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white font-bold text-xs">A</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900 text-sm">Scandere AI Team</span>
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Official</span>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{qa.answer.length > 100 ? `${qa.answer.substring(0, 100)}...` : qa.answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {qa.product && (
                        <div className="px-5 py-3 bg-gray-50 border-t">
                          <Link to={`/products/${qa.product.slug}#qa`} className="text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1 transition-colors">
                            View on product page <FiArrowRight size={14} />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={24}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  className="qa-swiper pb-12"
                >
                  {recentQA.map((qa) => (
                    <SwiperSlide key={qa.id} className="h-auto pb-2">
                      <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-brand-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                        {qa.product ? (
                          <div className="bg-brand-50 border-b border-brand-100 px-5 py-3">
                            <Link to={`/products/${qa.product.slug}`} className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors flex items-center gap-2">
                              <FiFileText size={14} /> {qa.product.title}
                            </Link>
                          </div>
                        ) : (
                          <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
                            <div className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                              <FiMessageCircle size={14} /> General Question
                            </div>
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="mb-4">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white font-bold text-xs">Q</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900 text-sm">{qa.user.first_name} {qa.user.last_name}</span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{qa.body.length > 120 ? `${qa.body.substring(0, 120)}...` : qa.body}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-auto">
                            <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                              <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white font-bold text-xs">A</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900 text-sm">Scandere AI Team</span>
                                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Official</span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{qa.answer.length > 100 ? `${qa.answer.substring(0, 100)}...` : qa.answer}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {qa.product && (
                          <div className="px-5 py-3 bg-gray-50 border-t">
                            <Link to={`/products/${qa.product.slug}#qa`} className="text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1 transition-colors">
                              View on product page <FiArrowRight size={14} />
                            </Link>
                          </div>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* CTA to view more */}
              <div className="text-center mt-10">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold transition-colors"
                >
                  Browse all products to see more Q&A <FiArrowRight />
                </Link>
              </div>
            </>
          )}

          {/* Question Form */}
          <div className="max-w-2xl mx-auto mt-12">
            <form onSubmit={handleSubmitQuestion} className="bg-white rounded-2xl border-2 border-brand-200 shadow-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMessageCircle className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Have a Question?</h3>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask us anything about our products or services..."
                    rows={3}
                    maxLength={2000}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                    disabled={submitting}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500">
                      {user ? 'Your question will be reviewed by our team' : 'Please log in to ask a question'}
                    </p>
                    <button
                      type="submit"
                      disabled={submitting || !question.trim()}
                      className="bg-brand-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                      {submitting ? 'Submitting...' : 'Submit Question'}
                      <FiArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / SOCIAL PROOF */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trusted by Entrepreneurs</h2>
            <p className="text-gray-600">Join hundreds of successful business owners</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {homeContent.stats.map((stat, i) => (
              <div key={stat.id || i}>
                <div className="text-4xl font-bold text-brand-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
