import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import BookCard from '../components/BookCard';
import { books, categories, brands } from '../data/books';

const sortOptions = [
  { value: 'popular',    label: 'Most Popular' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Highest Rated' },
];

export default function CataloguePage() {
  const [params, setParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 25]);

  const activeCategory = params.get('category') || '';
  const activeBrand    = params.get('brand') || '';
  const activeTag      = params.get('tag') || '';
  const query          = params.get('q') || '';

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  };

  const filtered = useMemo(() => {
    let list = [...books];
    if (query)          list = list.filter((b) => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()));
    if (activeCategory) list = list.filter((b) => b.category === activeCategory);
    if (activeBrand)    list = list.filter((b) => b.brand === activeBrand);
    if (activeTag)      list = list.filter((b) => b.tags?.includes(activeTag));
    list = list.filter((b) => b.price >= priceRange[0] && b.price <= priceRange[1]);
    if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [query, activeCategory, activeBrand, activeTag, priceRange, sort]);

  const Sidebar = () => (
    <aside className="w-56 flex-shrink-0 space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-zinc-300 mb-3 flex items-center gap-1 text-sm uppercase tracking-widest">
          <FiChevronDown /> Categories
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setFilter('category', '')}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                !activeCategory
                  ? 'bg-orange-500 text-white font-medium'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setFilter('category', cat.id)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-orange-500 text-white font-medium'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Publishers */}
      <div>
        <h3 className="font-semibold text-zinc-300 mb-3 flex items-center gap-1 text-sm uppercase tracking-widest">
          <FiChevronDown /> Publishers
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setFilter('brand', '')}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                !activeBrand
                  ? 'bg-orange-500 text-white font-medium'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              All Publishers
            </button>
          </li>
          {brands.map((b) => (
            <li key={b.id}>
              <button
                onClick={() => setFilter('brand', b.id)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  activeBrand === b.id
                    ? 'bg-orange-500 text-white font-medium'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {b.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-zinc-300 mb-3 text-sm uppercase tracking-widest">
          Price Range
        </h3>
        <input
          type="range" min={0} max={25} step={1}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-full accent-orange-500"
        />
        <div className="flex justify-between text-sm text-zinc-400 mt-1">
          <span>$0</span><span>Up to ${priceRange[1]}</span>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-zinc-500 mb-4">
          <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white font-medium">Catalogue</span>
          {activeCategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-white font-medium capitalize">{activeCategory}</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {query ? `Results for "${query}"` : activeCategory ? categories.find((c) => c.id === activeCategory)?.label : 'All Books'}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">{filtered.length} books found</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <FiFilter /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters */}
        {(activeCategory || activeBrand || activeTag || query) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {query && (
              <span className="flex items-center gap-1 bg-zinc-800 text-orange-400 text-xs font-medium px-3 py-1 rounded-full border border-zinc-700">
                Search: {query}
                <button onClick={() => setFilter('q', '')}><FiX className="text-xs" /></button>
              </span>
            )}
            {activeCategory && (
              <span className="flex items-center gap-1 bg-zinc-800 text-orange-400 text-xs font-medium px-3 py-1 rounded-full border border-zinc-700">
                {categories.find((c) => c.id === activeCategory)?.label}
                <button onClick={() => setFilter('category', '')}><FiX className="text-xs" /></button>
              </span>
            )}
            {activeBrand && (
              <span className="flex items-center gap-1 bg-zinc-800 text-orange-400 text-xs font-medium px-3 py-1 rounded-full border border-zinc-700">
                {brands.find((b) => b.id === activeBrand)?.name}
                <button onClick={() => setFilter('brand', '')}><FiX className="text-xs" /></button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 flex md:hidden">
              <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
              <div className="relative bg-zinc-900 w-72 p-6 overflow-y-auto border-r border-zinc-800">
                <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
                  <FiX />
                </button>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-zinc-500">
                <p className="text-4xl mb-4">📚</p>
                <p className="text-lg font-medium text-zinc-400">No books found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((book) => <BookCard key={book.id} book={book} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
