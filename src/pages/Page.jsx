import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import SEOHead from '../components/SEOHead';

export default function Page() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await api.getPage(slug);
        setPage(data);
      } catch (err) {
        console.error('Failed to load page:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-20 text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="text-brand-600 hover:text-brand-700 font-medium">
            &larr; Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={page.meta_title || page.title}
        description={page.meta_description}
        keywords={page.meta_keywords}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="text-brand-600 hover:text-brand-700 text-sm mb-6 inline-block">
          &larr; Back to home
        </Link>

        <article className="bg-white rounded-xl border p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{page.title}</h1>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </div>
    </>
  );
}
