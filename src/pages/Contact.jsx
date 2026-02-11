import { useState } from 'react';
import { api } from '../services/api';
import { FiMail, FiPhone, FiSend } from 'react-icons/fi';

export default function Contact() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', message: '', subscribe_newsletter: true });
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      const data = await api.contact(form);
      setOk(true); setMsg(data.message);
      setForm({ first_name: '', last_name: '', email: '', message: '', subscribe_newsletter: true });
    } catch (err) {
      setOk(false); setMsg(err.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">Have a question or need help? We'd love to hear from you.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border p-6 md:p-8">
            {msg && (
              <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${ok ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {msg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input type="text" value={form.first_name} onChange={set('first_name')} required
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input type="text" value={form.last_name} onChange={set('last_name')} required
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={set('email')} required
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tell us what you'd like help with? *</label>
                <textarea value={form.message} onChange={set('message')} rows={5} required
                  placeholder="Describe what you need help with..."
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>
              <label className="flex items-center gap-2 mb-6 cursor-pointer">
                <input type="checkbox" checked={form.subscribe_newsletter} onChange={set('subscribe_newsletter')}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm text-gray-600">Subscribe to Newsletter</span>
              </label>
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50">
                <FiSend size={16} />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FiMail className="text-brand-600" size={18} />
                <a href="mailto:team@scandere.info" className="text-gray-600 hover:text-brand-600">team@scandere.info</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiPhone className="text-brand-600" size={18} />
                <a href="tel:+12123658972" className="text-gray-600 hover:text-brand-600">+1-212-365-8972</a>
              </div>
            </div>
          </div>
          <div className="bg-brand-50 rounded-xl border border-brand-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
            <p className="text-sm text-gray-600">We typically respond within 24 hours during business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
