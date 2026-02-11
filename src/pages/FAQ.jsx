import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiHelpCircle, FiMail } from 'react-icons/fi';
import { api } from '../services/api';

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-gray-50 transition"
      >
        <span className="font-semibold text-gray-900 pr-8">{question}</span>
        <FiChevronDown
          className={`text-brand-600 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          size={20}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFaqs()
      .then(data => {
        setCategories(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load FAQs:', err);
        setLoading(false);
      });
  }, []);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const totalFaqs = categories.reduce((sum, cat) => sum + (cat.faqs?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiHelpCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/90">
            Find answers to common questions about our products, pricing, and services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg">Loading FAQs...</div>
          </div>
        ) : totalFaqs === 0 ? (
          <div className="text-center py-20">
            <FiHelpCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <div className="text-gray-400 text-lg">No FAQs available yet.</div>
          </div>
        ) : (
          <div className="space-y-8">
            {categories
              .filter(cat => cat.faqs && cat.faqs.length > 0)
              .map((category) => (
                <div key={category.id}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {category.name}
                  </h2>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {category.faqs.map((faq) => (
                      <FAQItem
                        key={faq.id}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openId === faq.id}
                        onToggle={() => toggleFAQ(faq.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Still have questions CTA */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Can't find the answer you're looking for? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl"
            >
              <FiMail size={20} />
              Contact Support
            </Link>
            <a
              href="mailto:team@scandere.info"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              team@scandere.info
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            We typically respond within 24 hours during business days
          </p>
        </div>
      </section>
    </div>
  );
}
