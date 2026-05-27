import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiCheck, FiGift, FiSmartphone } from 'react-icons/fi';
import { SiPaypal, SiApplepay, SiGooglepay } from 'react-icons/si';
import useStore from '../store/useStore';

const paymentMethods = [
  { id: 'card',   label: 'Credit / Debit Card', icon: <FiCreditCard className="text-xl" /> },
  { id: 'paypal', label: 'PayPal',               icon: <SiPaypal className="text-xl text-blue-600" /> },
  { id: 'apple',  label: 'Apple Pay',            icon: <SiApplepay className="text-xl" /> },
  { id: 'google', label: 'Google Pay',           icon: <SiGooglepay className="text-xl text-blue-500" /> },
  { id: 'upi',    label: 'UPI / Net Banking',    icon: <FiSmartphone className="text-xl text-green-600" /> },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, giftPoints, redeemPoints } = useStore();
  const [method, setMethod] = useState('card');
  const [redeemGift, setRedeemGift] = useState(false);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.08;
  const pointsDiscount = redeemGift ? Math.min(giftPoints * 0.01, subtotal * 0.1) : 0;
  const total = subtotal + tax - pointsDiscount;

  const handlePay = () => {
    if (redeemGift) redeemPoints(Math.min(giftPoints, Math.round(subtotal * 10)));
    navigate('/checkout/confirm');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['Address', 'Payment', 'Confirm'].map((step, i) => (
          <React.Fragment key={step}>
            <div className={`flex items-center gap-1.5 text-sm font-medium ${i === 1 ? 'text-primary-600' : i < 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 1 ? 'bg-primary-600 text-white' : i < 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < 1 ? <FiCheck /> : i + 1}
              </span>
              {step}
            </div>
            {i < 2 && <div className="flex-1 h-0.5 bg-gray-200 max-w-16" />}
          </React.Fragment>
        ))}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment</h1>

      <div className="grid gap-6">
        {/* Payment Methods */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Select Payment Method</h2>
          <div className="space-y-2">
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                onClick={() => setMethod(pm.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${method === pm.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                {pm.icon}
                <span className="font-medium text-gray-800 text-sm">{pm.label}</span>
                {method === pm.id && <FiCheck className="ml-auto text-primary-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Card Form */}
        {method === 'card' && (
          <div className="card p-5 space-y-3">
            <h2 className="font-semibold text-gray-900">Card Details</h2>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
              <input
                className="input-field"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={card.number}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                  setCard({ ...card, number: v.replace(/(.{4})/g, '$1 ').trim() });
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input className="input-field" placeholder="John Doe" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                <input className="input-field" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                <input className="input-field" placeholder="•••" maxLength={4} type="password" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {/* Gift Points */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiGift className="text-accent-500 text-xl" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Redeem Gift Points</p>
                <p className="text-xs text-gray-500">You have <span className="font-bold text-accent-600">{giftPoints} points</span> (≈ ${(giftPoints * 0.01).toFixed(2)} discount)</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={redeemGift} onChange={(e) => setRedeemGift(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          {redeemGift && (
            <p className="mt-2 text-sm text-green-600 font-medium">✓ ${pointsDiscount.toFixed(2)} discount applied!</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="card p-5 space-y-2 text-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-600">
              <span className="truncate max-w-xs">{item.title} × {item.qty}</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 space-y-1">
            <div className="flex justify-between text-gray-600"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            {redeemGift && <div className="flex justify-between text-green-600"><span>Gift Points Discount</span><span>-${pointsDiscount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-200">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePay}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
        >
          <FiCreditCard /> Pay ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
