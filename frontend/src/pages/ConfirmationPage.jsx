import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiDownload, FiShoppingBag, FiHome } from 'react-icons/fi';
import useStore from '../store/useStore';

export default function ConfirmationPage() {
  const { cart, clearCart, addOrder, user } = useStore();
  const navigate = useNavigate(); // eslint-disable-line no-unused-vars
  const saved = useRef(false);

  const orderId = `BV-${Date.now().toString(36).toUpperCase()}`;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  useEffect(() => {
    if (cart.length > 0 && !saved.current) {
      saved.current = true;
      addOrder({
        id: orderId,
        date: new Date().toISOString(),
        items: [...cart],
        total: total,
        status: 'Completed',
      });
      clearCart();
    }
  }, []); // eslint-disable-line

  if (cart.length === 0 && !saved.current) {
    // Already cleared — show confirmation
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <FiCheckCircle className="text-green-500 text-5xl" />
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Purchase Complete!</h1>
      <p className="text-gray-500 text-lg mb-1">Thank you for your order{user ? `, ${user.name}` : ''}!</p>
      <p className="text-gray-400 text-sm mb-6">
        Your e-books are ready for instant download. A confirmation has been sent to your email.
      </p>

      {/* Order ID */}
      <div className="inline-block bg-primary-50 border border-primary-200 rounded-xl px-6 py-3 mb-8">
        <p className="text-xs text-primary-500 font-medium uppercase tracking-widest mb-1">Order ID</p>
        <p className="text-xl font-bold text-primary-700 font-mono">{orderId}</p>
      </div>

      {/* Summary Card */}
      <div className="card p-6 text-left mb-8">
        <h2 className="font-bold text-gray-900 mb-4">What's Next?</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600 font-bold text-sm">1</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Download Your E-Books</p>
              <p className="text-xs text-gray-500">Access your books instantly from your order history.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-sm">2</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Check Your Email</p>
              <p className="text-xs text-gray-500">A receipt and download links have been sent to your email.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600 font-bold text-sm">3</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Earn Gift Points</p>
              <p className="text-xs text-gray-500">You earned points on this purchase. Use them on your next order!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          <FiDownload /> Download Books
        </button>
        <Link to="/orders" className="flex items-center gap-2 border border-gray-300 hover:border-primary-400 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors">
          <FiShoppingBag /> View Orders
        </Link>
        <Link to="/" className="flex items-center gap-2 border border-gray-300 hover:border-primary-400 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors">
          <FiHome /> Back to Home
        </Link>
      </div>

      {/* Confetti-like decoration */}
      <div className="mt-12 text-4xl space-x-2 opacity-60">
        🎉 📚 🎊 📖 ✨
      </div>
    </div>
  );
}
