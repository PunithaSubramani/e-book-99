import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';
import BookCard from '../components/BookCard';
import useStore from '../store/useStore';
import { books, categories } from '../data/books';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [qty, setQty] = useState(1);

  const book = books.find((b) => b.id === Number(id));
  if (!book) return (
    <div className="min-h-screen bg-black text-center py-20">
      <p className="text-4xl mb-4">📚</p>
      <p className="text-xl font-semibold text-white">Book not found</p>
      <Link to="/catalogue" className="text-orange-400 hover:underline mt-2 inline-block">Back to catalogue</Link>
    </div>
  );

  const isWishlisted = wishlist.some((b) => b.id === book.id);
  const related = books.filter((b) => b.category === book.category && b.id !== book.id).slice(0, 4);
  const category = categories.find((c) => c.id === book.category);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(book);
    toast.success(`${qty}× "${book.title}" added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) addToCart(book);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-zinc-500 mb-6 flex items-center gap-2 flex-wrap">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-orange-400 transition-colors">
            <FiArrowLeft /> Back
          </button>
          <span>/</span>
          <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/catalogue" className="hover:text-orange-400 transition-colors">Catalogue</Link>
          <span>/</span>
          <Link to={`/catalogue?category=${book.category}`} className="hover:text-orange-400 transition-colors">{category?.label}</Link>
          <span>/</span>
          <span className="text-zinc-300 truncate max-w-xs">{book.title}</span>
        </nav>

        {/* Main */}
        <div className="grid lg:grid-cols-3 gap-10 mb-12">
          {/* Image */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={book.image}
                alt={book.title}
                className="w-72 h-96 object-cover rounded-2xl shadow-2xl shadow-black/60"
              />
              {book.tags?.includes('bestseller') && (
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Bestseller
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <Link
                to={`/catalogue?category=${book.category}`}
                className="text-xs font-semibold text-orange-400 uppercase tracking-widest hover:underline"
              >
                {category?.icon} {category?.label}
              </Link>
              <h1 className="text-3xl font-extrabold text-white mt-1">{book.title}</h1>
              <p className="text-zinc-400 mt-1">by <span className="font-medium text-zinc-200">{book.author}</span></p>
            </div>

            <div className="flex items-center gap-3">
              <StarRating rating={book.rating} />
              <span className="text-sm text-zinc-400">{book.rating} ({book.reviews.toLocaleString()} reviews)</span>
            </div>

            <p className="text-zinc-400 leading-relaxed">{book.description}</p>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-orange-400">${book.price.toFixed(2)}</span>
              <span className="text-sm text-zinc-600 line-through">${(book.price * 1.3).toFixed(2)}</span>
              <span className="text-sm text-green-400 font-semibold">23% off</span>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-300">Quantity:</span>
              <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 hover:bg-zinc-700 text-lg font-bold text-white transition-colors">−</button>
                <span className="px-4 py-1.5 text-sm font-semibold border-x border-zinc-700 text-white">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-1.5 hover:bg-zinc-700 text-lg font-bold text-white transition-colors">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <FiShoppingCart /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Buy Now
              </button>
              <button
                onClick={() => { toggleWishlist(book); toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: '❤️' }); }}
                className="flex items-center gap-2 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-red-400 font-semibold px-4 py-3 rounded-xl transition-colors"
              >
                {isWishlisted ? <FaHeart className="text-red-500" /> : <FiHeart />}
              </button>
              <button className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold px-4 py-3 rounded-xl transition-colors">
                <FiShare2 />
              </button>
            </div>

            {/* Meta */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Format</span><span className="text-white font-medium">E-Book (PDF, EPUB)</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Language</span><span className="text-white font-medium">English</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Delivery</span><span className="text-green-400 font-medium">Instant Download</span></div>
            </div>
          </div>

           {/* Related Books */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Related Books</h2>
            <div className="space-y-4">
              {related.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </section>
        )}
        </div>

       
      </div>
    </div>
  );
}
