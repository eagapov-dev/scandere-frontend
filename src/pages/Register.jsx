import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setErrors({});
    try { await register(form); navigate('/dashboard'); }
    catch (err) { setErrors(err.errors || { general: [err.message || 'Registration failed.'] }); }
    setLoading(false);
  };

  const fields = [
    { key: 'first_name', label: 'First Name', type: 'text' },
    { key: 'last_name', label: 'Last Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'password', label: 'Password', type: 'password' },
    { key: 'password_confirmation', label: 'Verify Password', type: 'password' },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl border p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Your Account</h1>
        {errors.general && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{errors.general[0]}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {fields.slice(0, 2).map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={set(f.key)} required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors[f.key] ? 'border-red-500' : ''}`} />
                {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key][0]}</p>}
              </div>
            ))}
          </div>
          {fields.slice(2).map((f) => (
            <div className="mb-4" key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={set(f.key)} required
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors[f.key] ? 'border-red-500' : ''}`} />
              {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key][0]}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 font-medium disabled:opacity-50 mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
