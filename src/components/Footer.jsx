import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPinterestP, FaTiktok } from 'react-icons/fa';
import { FaThreads, FaRedditAlien, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcStripe } from 'react-icons/fa6';
import { api } from '../services/api';

const socialIconMap = {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube,
  FaPinterestP, FaTiktok, FaThreads, FaRedditAlien
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [footerLinks, setFooterLinks] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load categories
    api.getCategories()
      .then(data => setCategories(data))
      .catch(err => console.error('Footer: Failed to load categories:', err));

    // Load navigation and social links
    api.getHomeContent()
      .then(data => {
        setFooterLinks(data.footer_links || []);
        setSocialLinks(data.social_links || []);
      })
      .catch(err => console.error('Footer: Failed to load links:', err));
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const data = await api.subscribe({ email, source: 'footer' });
      setMsg(data.message);
      setEmail('');
    } catch { setMsg('Something went wrong.'); }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Newsletter bar */}
      <div className="bg-brand-700">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold text-lg">Subscribe to Our Newsletter</h3>
            <p className="text-brand-200 text-sm">Get the latest templates, tips, and exclusive deals.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="Enter your email"
              className="flex-1 md:w-72 px-4 py-2.5 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            <button type="submit" className="bg-white text-brand-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-50 text-sm whitespace-nowrap">
              Subscribe
            </button>
          </form>
          {msg && <p className="text-brand-100 text-sm">{msg}</p>}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">Scandere<span className="text-brand-400">AI</span></span>
            </Link>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">
              Premium small business resources — templates, checklists, and guides designed to help you launch and grow.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => {
                const IconComponent = socialIconMap[s.icon] || FaFacebookF;
                return (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition">
                    <IconComponent size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Products column - dynamically from categories */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white text-sm transition">All Products</Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.slug}`} className="text-gray-400 hover:text-white text-sm transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <Link to={link.url} className="text-gray-400 hover:text-white text-sm transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            <span>&copy; {new Date().getFullYear()} Scandere AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <span className="text-xs">We accept:</span>
            <FaCcVisa size={28} />
            <FaCcMastercard size={28} />
            <FaCcAmex size={28} />
            <FaCcStripe size={28} />
          </div>
        </div>
      </div>
    </footer>
  );
}
