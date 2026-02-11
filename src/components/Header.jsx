import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPinterestP, FaTiktok } from 'react-icons/fa';
import { FaThreads, FaRedditAlien } from 'react-icons/fa6';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiChevronDown } from 'react-icons/fi';

const socialIconMap = {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube,
  FaPinterestP, FaTiktok, FaThreads, FaRedditAlien
};

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const [headerLinks, setHeaderLinks] = useState([]);
  const [socialLinksData, setSocialLinksData] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load categories
    api.getCategories()
      .then(data => {
        console.log('Header: Loaded categories:', data);
        setCategories(data);
      })
      .catch(err => console.error('Header: Failed to load categories:', err));

    // Load navigation and social links
    api.getHomeContent()
      .then(data => {
        setHeaderLinks(data.header_links || []);
        setSocialLinksData(data.social_links || []);
      })
      .catch(err => console.error('Header: Failed to load navigation links:', err));
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  // Build navItems from headerLinks, with special handling for Products dropdown
  const navItems = headerLinks.map(link => {
    // Special case: Products link gets dynamic category dropdown
    if (link.url === '/products' && categories.length > 0) {
      return {
        label: link.label,
        to: link.url,
        children: [
          { label: 'All Products', to: '/products' },
          ...categories.map(cat => ({
            label: cat.name,
            to: `/products?category=${cat.slug}`
          }))
        ],
      };
    }
    // Regular link
    return {
      label: link.label,
      to: link.url,
    };
  });

  return (
    <header className="sticky top-0 z-50">
      {/* Bar 1: Top bar - social icons + contact info */}
      <div className="bg-brand-950 text-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-8 text-xs">
          <div className="flex items-center gap-3">
            {socialLinksData.map((s) => {
              const IconComponent = socialIconMap[s.icon] || FaFacebookF;
              return (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition" title={s.platform}>
                  <IconComponent size={13} />
                </a>
              );
            })}
          </div>
          <div className="hidden sm:flex items-center gap-4 text-gray-400">
            <span>team@scandere.info</span>
            <span>+1-212-365-8972</span>
          </div>
        </div>
      </div>

      {/* Bar 2: Main nav */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Scandere<span className="text-brand-600">AI</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navItems.map((item) => (
              <div key={item.label} className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}>
                <Link to={item.to}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-600 rounded-lg hover:bg-gray-50 transition">
                  {item.label}
                  {item.children && <FiChevronDown size={14} className={`transition ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
                </Link>

                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-0 w-56 bg-white border rounded-lg shadow-xl py-2 z-50">
                    {item.children.map((child) => (
                      <Link key={child.label} to={child.to}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition"
                        onClick={() => setActiveDropdown(null)}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-brand-600 transition">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-1 text-sm text-gray-600 hover:text-brand-600">
                  <FiUser size={16} />
                  <span>{user.first_name}</span>
                </Link>
                {user.is_admin && <Link to="/admin" className="text-xs text-brand-600 hover:text-brand-700 font-medium">Admin</Link>}
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">Logout</button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-600 hover:text-brand-600 px-3 py-1.5">Sign In</Link>
                <Link to="/register" className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700 font-medium">Sign Up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-600">
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Bar 3: Category bar (desktop) */}
      <div className="hidden lg:block bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-9 text-xs font-medium text-gray-500">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className={cat.slug === 'bundles'
                ? "text-red-500 hover:text-red-600 font-semibold"
                : "hover:text-brand-600 transition"}
            >
              {cat.slug === 'bundles' ? `🔥 ${cat.name}` : cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link to={item.to} className="block py-2 text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link key={child.label} to={child.to} className="block py-1 text-sm text-gray-500" onClick={() => setMobileOpen(false)}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <hr />
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="block py-2 text-gray-500">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="block py-2 text-brand-600 font-medium" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
