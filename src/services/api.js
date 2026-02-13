const API_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() { this.baseUrl = API_URL; }

  getToken() { return localStorage.getItem('token'); }
  setToken(t) { localStorage.setItem('token', t); }
  clearToken() { localStorage.removeItem('token'); }

  async request(endpoint, opts = {}) {
    const token = this.getToken();
    const headers = { Accept: 'application/json', ...opts.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (!(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${this.baseUrl}${endpoint}`, { ...opts, headers });
    if (res.status === 401) { this.clearToken(); window.location.href = '/login'; throw new Error('Unauthorized'); }
    if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Request failed' })); throw err; }

    const ct = res.headers.get('content-type');
    if (ct && !ct.includes('application/json')) return res;
    return res.json();
  }

  get(e) { return this.request(e); }
  post(e, d) { return this.request(e, { method: 'POST', body: d instanceof FormData ? d : JSON.stringify(d) }); }
  put(e, d) { return this.request(e, { method: 'PUT', body: JSON.stringify(d) }); }
  patch(e, d) { return this.request(e, { method: 'PATCH', body: JSON.stringify(d) }); }
  del(e) { return this.request(e, { method: 'DELETE' }); }

  // Auth
  async login(email, password) { const d = await this.post('/auth/login', { email, password }); this.setToken(d.token); return d; }
  async register(data) { const d = await this.post('/auth/register', data); this.setToken(d.token); return d; }
  async logout() { await this.post('/auth/logout'); this.clearToken(); }
  getUser() { return this.get('/auth/user'); }
  forgotPassword(email) { return this.post('/auth/forgot-password', { email }); }
  resetPassword(token, email, password, password_confirmation) {
    return this.post('/auth/reset-password', { token, email, password, password_confirmation });
  }

  // Email Verification
  verifyEmail(token) { return this.post('/auth/email/verify', { token }); }
  resendVerification() { return this.post('/auth/email/resend'); }
  getVerificationStatus() { return this.get('/auth/email/verification-status'); }

  // Public
  getFeatured() { return this.get('/featured'); }
  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/products${query ? '?' + query : ''}`);
  }
  getProduct(slug) { return this.get(`/products/${slug}`); }
  getCategories() { return this.get('/categories'); }
  getComments(productId, page = 1) { return this.get(`/products/${productId}/comments?page=${page}`); }
  getRecentQA(limit = 6) { return this.get(`/recent-qa?limit=${limit}`); }

  // Newsletter / Contact
  subscribe(data) { return this.post('/subscribe', data); }
  contact(data) { return this.post('/contact', data); }

  // Auth'd
  getDashboard() { return this.get('/dashboard'); }
  postComment(productId, body) { return this.post(`/products/${productId}/comments`, { body }); }
  postGeneralQuestion(body) { return this.post('/comments/general', { body }); }
  async downloadProduct(productId) {
    const token = this.getToken();
    const response = await fetch(`${this.baseUrl}/products/${productId}/download`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers.get('content-disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : 'product-file';

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Cart
  getCart() { return this.get('/cart'); }
  addToCart(productId) { return this.post('/cart/add', { product_id: productId }); }
  removeFromCart(productId) { return this.del(`/cart/${productId}`); }
  clearCart() { return this.del('/cart'); }
  addBundleToCart(bundleId) { return this.post(`/cart/bundle/${bundleId}`); }

  // Checkout
  checkout() { return this.post('/checkout'); }
  paymentSuccess(sessionId) { return this.get(`/payment/success?session_id=${sessionId}`); }

  // Admin
  getAdminStats() { return this.get('/admin/stats'); }
  getAdminProducts() { return this.get('/admin/products'); }
  createProduct(fd) { return this.post('/admin/products', fd); }
  updateProduct(id, fd) { fd.append('_method', 'PUT'); return this.post(`/admin/products/${id}`, fd); }
  deleteProduct(id) { return this.del(`/admin/products/${id}`); }
  getAdminSubscribers() { return this.get('/admin/subscribers'); }
  exportSubscribers() { return this.request('/admin/subscribers/export'); }
  getAdminOrders() { return this.get('/admin/orders'); }
  getAdminComments() { return this.get('/admin/comments'); }
  updateComment(id, data) { return this.put(`/admin/comments/${id}`, data); }
  approveComment(id) { return this.patch(`/admin/comments/${id}/approve`); }
  deleteComment(id) { return this.del(`/admin/comments/${id}`); }
  getAdminMessages() { return this.get('/admin/messages'); }
  markMessageRead(id) { return this.patch(`/admin/messages/${id}/read`); }
  getAdminBundles() { return this.get('/admin/bundles'); }
  createBundle(data) { return this.post('/admin/bundles', data); }
  updateBundle(id, data) { return this.put(`/admin/bundles/${id}`, data); }
  deleteBundle(id) { return this.del(`/admin/bundles/${id}`); }
  getAdminCategories() { return this.get('/admin/categories'); }
  createCategory(data) { return this.post('/admin/categories', data); }
  updateCategory(id, data) { return this.put(`/admin/categories/${id}`, data); }
  deleteCategory(id) { return this.del(`/admin/categories/${id}`); }
  getFaqs() { return this.get('/faqs'); }
  getAdminFaqs() { return this.get('/admin/faqs'); }
  createFaq(data) { return this.post('/admin/faqs', data); }
  updateFaq(id, data) { return this.put(`/admin/faqs/${id}`, data); }
  deleteFaq(id) { return this.del(`/admin/faqs/${id}`); }
  getAdminFaqCategories() { return this.get('/admin/faq-categories'); }
  createFaqCategory(data) { return this.post('/admin/faq-categories', data); }
  updateFaqCategory(id, data) { return this.put(`/admin/faq-categories/${id}`, data); }
  deleteFaqCategory(id) { return this.del(`/admin/faq-categories/${id}`); }

  // Home Content
  getHomeContent() { return this.get('/home-content'); }

  // Hero Slides
  getAdminHeroSlides() { return this.get('/admin/hero-slides'); }
  createHeroSlide(data) { return this.post('/admin/hero-slides', data); }
  updateHeroSlide(id, data) { return this.put(`/admin/hero-slides/${id}`, data); }
  deleteHeroSlide(id) { return this.del(`/admin/hero-slides/${id}`); }

  // Home Features
  getAdminHomeFeatures() { return this.get('/admin/home-features'); }
  createHomeFeature(data) { return this.post('/admin/home-features', data); }
  updateHomeFeature(id, data) { return this.put(`/admin/home-features/${id}`, data); }
  deleteHomeFeature(id) { return this.del(`/admin/home-features/${id}`); }

  // Home Stats
  getAdminHomeStats() { return this.get('/admin/home-stats'); }
  createHomeStat(data) { return this.post('/admin/home-stats', data); }
  updateHomeStat(id, data) { return this.put(`/admin/home-stats/${id}`, data); }
  deleteHomeStat(id) { return this.del(`/admin/home-stats/${id}`); }

  // Home Showcases
  getAdminHomeShowcases() { return this.get('/admin/home-showcases'); }
  createHomeShowcase(data) { return this.post('/admin/home-showcases', data); }
  updateHomeShowcase(id, data) { return this.put(`/admin/home-showcases/${id}`, data); }
  deleteHomeShowcase(id) { return this.del(`/admin/home-showcases/${id}`); }

  // Social Links
  getAdminSocialLinks() { return this.get('/admin/social-links'); }
  createSocialLink(data) { return this.post('/admin/social-links', data); }
  updateSocialLink(id, data) { return this.put(`/admin/social-links/${id}`, data); }
  deleteSocialLink(id) { return this.del(`/admin/social-links/${id}`); }

  // Navigation Links
  getAdminNavigationLinks() { return this.get('/admin/navigation-links'); }
  createNavigationLink(data) { return this.post('/admin/navigation-links', data); }
  updateNavigationLink(id, data) { return this.put(`/admin/navigation-links/${id}`, data); }
  deleteNavigationLink(id) { return this.del(`/admin/navigation-links/${id}`); }

  // Newsletter Campaigns
  getNewsletterStats() { return this.get('/admin/newsletter/stats'); }
  sendNewsletterCampaign(data) { return this.post('/admin/newsletter/send', data); }

  // Pages (public)
  getPage(slug) { return this.get(`/pages/${slug}`); }

  // Pages (admin)
  getAdminPages() { return this.get('/admin/pages'); }
  createPage(data) { return this.post('/admin/pages', data); }
  updatePage(id, data) { return this.put(`/admin/pages/${id}`, data); }
  deletePage(id) { return this.del(`/admin/pages/${id}`); }
}

export const api = new ApiService();
