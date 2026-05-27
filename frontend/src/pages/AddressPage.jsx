import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiPlus, FiCheck } from 'react-icons/fi';

const savedAddresses = [
  { id: 1, name: 'Home', line1: '42 Maple Street', city: 'Austin', state: 'TX', zip: '78701', country: 'USA', default: true },
  { id: 2, name: 'Office', line1: '100 Tech Blvd, Suite 200', city: 'San Francisco', state: 'CA', zip: '94105', country: 'USA', default: false },
];

export default function AddressPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', line1: '', city: '', state: '', zip: '', country: 'USA' });

  const handleContinue = () => navigate('/checkout/payment');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['Address', 'Payment', 'Confirm'].map((step, i) => (
          <React.Fragment key={step}>
            <div className={`flex items-center gap-1.5 text-sm font-medium ${i === 0 ? 'text-primary-600' : 'text-gray-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</span>
              {step}
            </div>
            {i < 2 && <div className="flex-1 h-0.5 bg-gray-200 max-w-16" />}
          </React.Fragment>
        ))}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiMapPin className="text-primary-600" /> Select Delivery Address
      </h1>

      <div className="space-y-3 mb-6">
        {savedAddresses.map((addr) => (
          <button
            key={addr.id}
            onClick={() => setSelected(addr.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected === addr.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{addr.name}</span>
                  {addr.default && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
                </div>
                <p className="text-sm text-gray-600">{addr.line1}</p>
                <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-sm text-gray-600">{addr.country}</p>
              </div>
              {selected === addr.id && (
                <span className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-white text-xs" />
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Add new address */}
      <button
        onClick={() => setShowNew(!showNew)}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm mb-4"
      >
        <FiPlus /> Add New Address
      </button>

      {showNew && (
        <div className="card p-5 mb-6 space-y-3">
          <h3 className="font-semibold text-gray-900">New Address</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Label (e.g. Home, Work)</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Home" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Street Address</label>
              <input className="input-field" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="123 Main St" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
              <input className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
              <input className="input-field" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">ZIP Code</label>
              <input className="input-field" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} placeholder="00000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
              <input className="input-field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="USA" />
            </div>
          </div>
          <button className="btn-primary w-full py-2 rounded-lg text-sm">Save Address</button>
        </div>
      )}

      <button
        onClick={handleContinue}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors"
      >
        Continue to Payment
      </button>
    </div>
  );
}
