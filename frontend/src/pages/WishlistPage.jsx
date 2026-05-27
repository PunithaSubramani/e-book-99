import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import useStore from '../store/useStore';
import BookCard from '../components/BookCard';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, addToCart } = useStore();

  const handleAddAll = () => {
    wishlist.forEach((b) => addToCart(b));
    toast.success('All wishlist items added to cart!');
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <FiHeart className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save books you love by clicking the heart icon.</p>
        <Link to="/catalogue" className="btn-primary px-8 py-3 rounded-full inline-block">Browse Books</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiHeart className="text-red-500" /> Wishlist ({wishlist.length})
        </h1>
        <button
          onClick={handleAddAll}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <FiShoppingCart /> Add All to Cart
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.map((book) => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
  );
}
