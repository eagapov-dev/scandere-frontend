import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Extract token and email from URL query parameters
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (!tokenParam || !emailParam) {
      setMsg('Invalid reset link. Please request a new password reset.');
      setOk(false);
    } else {
      setToken(tokenParam);
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (password !== passwordConfirmation) {
      setMsg('Passwords do not match.');
      setOk(false);
      return;
    }

    if (password.length < 8) {
      setMsg('Password must be at least 8 characters long.');
      setOk(false);
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const data = await api.resetPassword(token, email, password, passwordConfirmation);
      setSuccess(true);
      setOk(true);
      setMsg(data.message || 'Password reset successfully!');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successfully. Please log in with your new password.' } });
      }, 3000);
    } catch (err) {
      setOk(false);
      setMsg(err.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl border p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-green-600">
              <FiCheckCircle className="w-full h-full" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h1>
            <p className="text-gray-600 mb-6">{msg}</p>
            <p className="text-sm text-gray-500">Redirecting you to login...</p>
            <Link
              to="/login"
              className="inline-block mt-4 text-brand-600 hover:text-brand-700 font-medium"
            >
              Go to Login Now →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl border p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Reset Your Password</h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Enter a new password for <strong>{email}</strong>
        </p>

        {msg && (
          <div className={`px-4 py-2 rounded-lg mb-4 text-sm flex items-start gap-2 ${
            ok
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters with mixed case and numbers
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              placeholder="Confirm new password"
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token || !email}
            className="w-full bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Link to="/login" className="text-brand-600 hover:text-brand-700">&larr; Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
