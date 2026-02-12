import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FiMail, FiX } from 'react-icons/fi';

export default function EmailVerificationBanner() {
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const response = await api.getVerificationStatus();
      setShow(!response.verified);
    } catch (err) {
      // If error, don't show banner
      setShow(false);
    }
  };

  const handleResend = async () => {
    try {
      setSending(true);
      setMessage('');
      await api.resendVerification();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setMessage(err.message || 'Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  if (!show) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <FiMail className="text-yellow-600 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Please verify your email address to access all features.
              </p>
              {message && (
                <p className="text-xs text-yellow-700 mt-1">{message}</p>
              )}
            </div>
            <button
              onClick={handleResend}
              disabled={sending}
              className="px-4 py-1.5 text-sm font-medium text-yellow-800 bg-yellow-100 rounded hover:bg-yellow-200 transition-colors disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Resend Email'}
            </button>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-yellow-600 hover:text-yellow-800 flex-shrink-0"
            aria-label="Dismiss"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
