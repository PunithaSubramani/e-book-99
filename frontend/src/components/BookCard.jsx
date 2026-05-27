import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

export default function BookCard({ book }) {
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
          className="absolute top-2 right-2 bg-zinc-900/80 rounded-full p-1.5 shadow hover:scale-110 transition-transform"
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
