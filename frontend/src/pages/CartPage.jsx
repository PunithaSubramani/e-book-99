import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import useStore from '../store/useStore';
import BookCard from '../components/BookCard';
import { books } from '../data/books';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, orders } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Recommendations based on order history categories
  const historyCats = orders.flatMap((o) => o.items.map((i) => i.category));
  const recommended = books
    .filter((b) => historyCats.includes(b.category) && !cart.find((c) => c.id === b.id))
    .slice(0, 4);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any books yet.</p>
        <Link to="/catalogue" className="btn-primary px-8 py-3 rounded-full inline-block">Browse Books</Link>

        {recommended.length > 0 && (
          <div className="mt-12 text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended for You</h3>
            <div className="grid grid-cols-2 gap-4">
              {recommended.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({cart.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link to={`/book/${item.id}`}>
                <img src={item.image} alt={item.title} className="w-20 h-28 object-cover rounded-lg flex-shrink-0" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/book/${item.id}`} className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2">{item.title}</Link>
                <p className="text-sm text-gray-500 mt-0.5">{item.author}</p>
                <p className="text-primary-700 font-bold mt-1">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2.5 py-1 hover:bg-gray-100 font-bold">−</button>
                    <span className="px-3 py-1 text-sm font-semibold border-x border-gray-300">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2.5 py-1 hover:bg-gray-100 font-bold">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout/address')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Proceed to Checkout <FiArrowRight />
            </button>
            <Link to="/catalogue" className="block text-center text-sm text-primary-600 hover:underline">
              Continue Shopping
            </Link>
          </div>

          {/* Gift points notice */}
          <div className="card p-4 bg-orange-50 border-orange-200">
            <p className="text-sm text-orange-700 font-medium">🎁 You have gift points to redeem at checkout!</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Based on Your History</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recommended.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </section>
      )}
    </div>
  );
}
