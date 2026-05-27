import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import useStore from '../store/useStore';
import { books, categories } from '../data/books';
import toast from 'react-hot-toast';

function BookGridCard({ book }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.some((b) => b.id === book.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(book);
    toast.success(`"${book.title}" added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(book);
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  return (
    <Link
      to={`/book/${book.id}`}
      className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500 transition-all duration-200 flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {book.tags?.includes('bestseller') && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Bestseller
          </span>
        )}
        {book.tags?.includes('new') && !book.tags?.includes('bestseller') && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            New
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 bg-zinc-900/80 rounded-full p-1.5 hover:scale-110 transition-transform"
        >
          {isWishlisted
            ? <FaHeart className="text-red-500 text-sm" />
            : <FiHeart className="text-zinc-300 text-sm" />}
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-orange-400 font-medium uppercase tracking-wide mb-0.5">
          {book.author}
        </p>
        <h3 className="font-semibold text-white text-sm leading-snug mb-1 line-clamp-2">
          {book.title}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <FiStar className="text-yellow-400 text-xs" />
          <span className="text-xs text-zinc-400">
            {book.rating} ({book.reviews.toLocaleString()})
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-orange-400">
            ${book.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <FiShoppingCart className="text-sm" /> Add
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('');

  const filtered = useMemo(() => {
    if (!activeCategory) return books;
    return books.filter((b) => b.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">

          {/* ── Left sidebar: Categories ── */}
          <aside className="w-56 flex-shrink-0">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 px-3">
              Categories
            </h2>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveCategory('')}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === ''
                      ? 'bg-orange-500 text-white'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">📚</span> All Books
                  <span className="ml-auto text-xs opacity-60">{books.length}</span>
                </button>
              </li>
              {categories.map((cat) => {
                const count = books.filter((b) => b.category === cat.id).length;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-orange-500 text-white'
                          : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      {cat.label}
                      <span className="ml-auto text-xs opacity-60">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Promo box */}
            <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-400 mb-1">Sign up bonus</p>
              <p className="text-orange-400 font-bold text-lg">150 Points</p>
              <p className="text-xs text-zinc-500 mt-1 mb-3">
                Redeem on your next purchase
              </p>
              <Link
                to="/login"
                className="block text-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                Join Free
              </Link>
            </div>
          </aside>

          {/* ── Right: Book grid ── */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-white">
                  {activeCategory
                    ? categories.find((c) => c.id === activeCategory)?.label
                    : 'All Books'}
                </h1>
                <p className="text-sm text-zinc-400 mt-0.5">
                  {filtered.length} book{filtered.length !== 1 ? 's' : ''} available
                </p>
              </div>
              <Link
                to="/catalogue"
                className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                Browse catalogue <FiArrowRight />
              </Link>
            </div>

            {/* 3-column grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-zinc-500">
                <p className="text-4xl mb-4">📚</p>
                <p className="text-lg font-medium">No books in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filtered.map((book) => (
                  <BookGridCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-3">BookVerse</h3>
            <p className="text-sm text-zinc-500">
              Your digital library for every genre and every reader.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-1 text-sm text-zinc-500">
              <li><Link to="/catalogue" className="hover:text-white transition-colors">All Books</Link></li>
              <li><Link to="/catalogue?tag=bestseller" className="hover:text-white transition-colors">Bestsellers</Link></li>
              <li><Link to="/catalogue?tag=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-1 text-sm text-zinc-500">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-1 text-sm text-zinc-500">
              <li><span className="hover:text-white cursor-pointer transition-colors">Help Center</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Contact Us</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-zinc-800 text-center text-sm text-zinc-600">
          © 2026 BookVerse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
