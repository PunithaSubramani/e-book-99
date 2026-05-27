import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiRefreshCw } from 'react-icons/fi';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { orders, addToCart } = useStore();

  const handleBuyAgain = (items) => {
    items.forEach((item) => addToCart(item));
    toast.success('Items added to cart!');
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Your order history will appear here after your first purchase.</p>
        <Link to="/catalogue" className="btn-primary px-8 py-3 rounded-full inline-block">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiShoppingBag className="text-primary-600" /> Order History
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="card overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                  <p className="font-mono font-semibold text-gray-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                  <p className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                  <p className="font-bold text-primary-700">${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    ✓ {order.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleBuyAgain(order.items)}
                className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <FiRefreshCw className="text-xs" /> Buy It Again
              </button>
            </div>

            {/* Order Items */}
            <div className="p-5 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Link to={`/book/${item.id}`}>
                    <img src={item.image} alt={item.title} className="w-14 h-20 object-cover rounded-lg flex-shrink-0" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/book/${item.id}`} className="font-medium text-gray-900 hover:text-primary-600 text-sm line-clamp-1">{item.title}</Link>
                    <p className="text-xs text-gray-500">{item.author}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">${(item.price * item.qty).toFixed(2)}</p>
                    <button className="text-xs text-primary-600 hover:underline mt-1">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
