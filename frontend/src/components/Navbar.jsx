import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiBook } from 'react-icons/fi';
import useStore from '../store/useStore';

export default function Navbar() {
  const { cart, user, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/catalogue?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <FiBook className="text-orange-500 text-2xl" />
            <span>BookVerse</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search books, authors..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-zinc-400 hover:text-orange-400 transition-colors">
                <FiSearch />
              </button>
            </div>
          </form>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/catalogue" className="text-sm text-zinc-300 hover:text-white transition-colors">
              Catalogue
            </Link>
            <Link to="/wishlist" className="relative text-zinc-300 hover:text-orange-400 transition-colors">
              <FiHeart className="text-xl" />
            </Link>
            <Link to="/cart" className="relative text-zinc-300 hover:text-orange-400 transition-colors">
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/orders" className="text-sm text-zinc-300 hover:text-white transition-colors">
                  Orders
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm text-zinc-300 hover:text-white transition-colors"
              >
                <FiUser /> Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-zinc-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 pb-4 space-y-3">
          <form onSubmit={handleSearch} className="flex pt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-l-full py-2 pl-4 text-sm text-white placeholder-zinc-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-orange-500 rounded-r-full px-4 text-white hover:bg-orange-600 transition-colors"
            >
              <FiSearch />
            </button>
          </form>
          <Link to="/catalogue" className="block text-sm text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            Catalogue
          </Link>
          <Link to="/cart" className="block text-sm text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            Cart ({cartCount})
          </Link>
          <Link to="/orders" className="block text-sm text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>
            Orders
          </Link>
          {user
            ? <button onClick={() => { logout(); setMenuOpen(false); }} className="block text-sm text-zinc-300 hover:text-white">Logout</button>
            : <Link to="/login" className="block text-sm text-zinc-300 hover:text-white" onClick={() => setMenuOpen(false)}>Login</Link>
          }
        </div>
      )}
    </nav>
  );
}
