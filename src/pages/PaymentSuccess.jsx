import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { FiCheckCircle } from 'react-icons/fi';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const { refreshCart } = useCart();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      api.paymentSuccess(sessionId)
        .then((data) => { setOrder(data.order); refreshCart(); })
        .catch(() => setError('Could not verify payment.'));
    }
  }, [searchParams, refreshCart]);

  if (error) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <Link to="/dashboard" className="text-brand-600">Go to Dashboard</Link>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <FiCheckCircle size={64} className="text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
      <p className="text-gray-500 mb-8">Thank you for your purchase. You can download your files from your dashboard.</p>
      <Link to="/dashboard" className="bg-brand-600 text-white px-8 py-3 rounded-lg hover:bg-brand-700 font-medium">
        Go to Dashboard
      </Link>
    </div>
  );
}
