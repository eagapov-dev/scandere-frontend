import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMsg('');
    try { const d = await api.forgotPassword(email); setOk(true); setMsg(d.message); }
    catch (err) { setOk(false); setMsg(err.message || 'Something went wrong.'); }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl border p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Reset Password</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Enter your email and we'll send you a reset link.</p>
        {msg && <div className={`px-4 py-2 rounded-lg mb-4 text-sm ${ok ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          <Link to="/login" className="text-brand-600 hover:text-brand-700">&larr; Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
