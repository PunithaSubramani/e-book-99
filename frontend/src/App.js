import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CataloguePage from './pages/CataloguePage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import AddressPage from './pages/AddressPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Login has its own full-screen layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* All other routes use the Navbar layout */}
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/catalogue" element={<Layout><CataloguePage /></Layout>} />
        <Route path="/book/:id" element={<Layout><BookDetailPage /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/checkout/address" element={<Layout><AddressPage /></Layout>} />
        <Route path="/checkout/payment" element={<Layout><PaymentPage /></Layout>} />
        <Route path="/checkout/confirm" element={<Layout><ConfirmationPage /></Layout>} />
        <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
        <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
