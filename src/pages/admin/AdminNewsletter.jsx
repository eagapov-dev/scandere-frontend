import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiMail, FiSend, FiUsers, FiUserX } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';

export default function AdminNewsletter() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getNewsletterStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      alert('Failed to load newsletter statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length > 255) {
      newErrors.subject = 'Subject must be less than 255 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Message content is required';
    } else if (formData.content.length > 10000) {
      newErrors.content = 'Content must be less than 10,000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    if (!stats || stats.active_subscribers === 0) {
      alert('No active subscribers to send to!');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to send this newsletter to ${stats.active_subscribers} active subscribers?\n\n` +
      `Subject: ${formData.subject}\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setSending(true);
      const response = await api.sendNewsletterCampaign(formData);
      setSuccess(response.message || 'Newsletter campaign sent successfully!');
      // Clear form
      setFormData({ subject: '', content: '' });
      // Reload stats
      loadStats();
    } catch (err) {
      console.error('Failed to send campaign:', err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        alert(err.message || 'Failed to send newsletter campaign');
      }
    } finally {
      setSending(false);
    }
  };

  const handlePreview = () => {
    const previewContent = `
Subject: ${formData.subject || '(no subject)'}

---

${formData.content || '(no content)'}

---

[Browse Our Products Button]

Thank you for being part of the Scandere AI community!

Best regards,
The Scandere AI Team

---
You're receiving this email because you subscribed to the Scandere AI newsletter.
[Unsubscribe Link]
    `.trim();

    alert(previewContent);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Campaign</h1>
          <p className="text-gray-500 mt-1">Send email campaigns to all active subscribers</p>
        </div>

        {/* Statistics Cards */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Subscribers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total_subscribers}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FiMail className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Active Subscribers</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active_subscribers}</p>
                  <p className="text-xs text-gray-400 mt-1">Will receive this campaign</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FiUsers className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Unsubscribed</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.unsubscribed}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <FiUserX className="text-gray-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <FiSend className="text-green-600" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Campaign Form */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Newsletter Campaign</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., New AI Tools Released!"
                maxLength={255}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.subject.length}/255 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Message Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                placeholder="Write your newsletter message here...&#10;&#10;Example:&#10;Hello subscribers!&#10;&#10;We're excited to announce new AI tools available in our store.&#10;&#10;Check them out today and get 20% off with code: NEW20&#10;&#10;Best regards,&#10;The Team"
                maxLength={10000}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono text-sm ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.content.length}/10,000 characters • Supports line breaks
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">ℹ️ Campaign Details</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Emails will be sent to <strong>{stats?.active_subscribers || 0}</strong> active subscribers</li>
                <li>• All emails are queued and sent in the background</li>
                <li>• Unsubscribe link is automatically included</li>
                <li>• "Browse Products" button is added to each email</li>
                <li>• Failed emails will be retried 3 times automatically</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePreview}
                disabled={!formData.subject && !formData.content}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview
              </button>

              <button
                type="submit"
                disabled={sending || !stats || stats.active_subscribers === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Send Campaign to {stats?.active_subscribers || 0} Subscribers
                  </>
                )}
              </button>
            </div>

            {stats?.active_subscribers === 0 && (
              <p className="text-sm text-red-500 text-center">
                ⚠️ No active subscribers found. Cannot send campaign.
              </p>
            )}
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gray-50 rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Content Tips:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Keep subject lines short and compelling</li>
                <li>Personalize when possible</li>
                <li>Include a clear call-to-action</li>
                <li>Keep content concise and valuable</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Timing:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Best days: Tuesday - Thursday</li>
                <li>Best time: 10 AM - 2 PM</li>
                <li>Avoid: Monday mornings, Friday evenings</li>
                <li>Frequency: Max once per week</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
