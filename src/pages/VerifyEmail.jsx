import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FiCheckCircle, FiXCircle, FiMail, FiLoader } from 'react-icons/fi';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error, expired
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      setStatus('verifying');
      const response = await api.verifyEmail(token);
      setStatus('success');
      setMessage(response.message || 'Email verified successfully!');

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setStatus('error');
      const errorMessage = err.message || 'Verification failed. The link may be invalid or expired.';
      setMessage(errorMessage);

      // Check if link expired
      if (errorMessage.includes('expired')) {
        setStatus('expired');
      }
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await api.resendVerification();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setMessage(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl border p-8 text-center">
          {/* Verifying */}
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 text-brand-600">
                <FiLoader className="w-full h-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h1>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 text-green-600">
                <FiCheckCircle className="w-full h-full" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500">Redirecting you to dashboard...</p>
              <Link
                to="/dashboard"
                className="inline-block mt-4 text-brand-600 hover:text-brand-700 font-medium"
              >
                Go to Dashboard Now →
              </Link>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 text-red-600">
                <FiXCircle className="w-full h-full" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 font-medium"
                >
                  Go to Login
                </Link>
                <Link
                  to="/register"
                  className="block text-brand-600 hover:text-brand-700 font-medium"
                >
                  Create New Account
                </Link>
              </div>
            </>
          )}

          {/* Expired */}
          {status === 'expired' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 text-yellow-600">
                <FiMail className="w-full h-full" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              {api.getToken() ? (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 font-medium"
                >
                  Login to Resend
                </Link>
              )}
            </>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{' '}
          <Link to="/contact" className="text-brand-600 hover:text-brand-700">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
