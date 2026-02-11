import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import BundleCard from '../components/BundleCard';

export default function Products() {
  const [products, setProducts] = useState({ data: [] });
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const category = searchParams.get('category') || '';
  const isBundlesCategory = category === 'bundles';

  useEffect(() => {
    api.getCategories()
      .then(data => {
        console.log('=== CATEGORIES LOADED ===');
        console.log('Total categories:', data.length);
        console.log('All categories:', data);
        data.forEach((cat, index) => {
          console.log(`${index + 1}. ${cat.name} (slug: ${cat.slug}, id: ${cat.id})`);
        });
        console.log('========================');
        setCategories(data);
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (searchParams.get('search')) params.set('search', searchParams.get('search'));
    if (searchParams.get('page')) params.set('page', searchParams.get('page'));
    api.getProducts(`?${params}`).then(setProducts).catch(() => {});
  }, [category, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = {};
    if (category) p.category = category;
    if (search) p.search = search;
    setSearchParams(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isBundlesCategory ? 'Bundle Deals' : 'Products'}
      </h1>
      <p className="text-gray-500 mb-8">
        {isBundlesCategory
          ? 'Get multiple products together and save big!'
          : 'Templates, checklists, and guides for your business'}
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <button type="submit" className="bg-brand-600 text-white px-5 py-2 rounded-lg hover:bg-brand-700 text-sm font-medium">Search</button>
        </form>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSearchParams(search ? { search } : {})}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${!category ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
          {categories.length > 0 ? (
            categories.map((c) => (
              <button key={c.id} onClick={() => setSearchParams({ category: c.slug, ...(search && { search }) })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${category === c.slug ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {c.name}
              </button>
            ))
          ) : (
            <span className="text-gray-400 text-sm">Loading categories...</span>
          )}
        </div>
      </div>

      {products.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isBundlesCategory
            ? products.data.map((b) => <BundleCard key={b.id} bundle={b} />)
            : products.data.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            {isBundlesCategory ? 'No bundles found.' : 'No products found.'}
          </p>
        </div>
      )}
    </div>
  );
}
