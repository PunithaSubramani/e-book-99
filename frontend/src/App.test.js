import React from 'react';
import { render, screen } from '@testing-library/react';

// Smoke test — just verify the app renders without crashing
jest.mock('./store/useStore', () => () => ({
  cart: [], user: null, wishlist: [], orders: [],
  addToCart: jest.fn(), removeFromCart: jest.fn(), updateQty: jest.fn(),
  clearCart: jest.fn(), setUser: jest.fn(), logout: jest.fn(),
  addOrder: jest.fn(), redeemPoints: jest.fn(), toggleWishlist: jest.fn(),
  giftPoints: 150,
}));

jest.mock('react-hot-toast', () => ({ success: jest.fn(), __esModule: true, default: jest.fn(), Toaster: () => null }));

import App from './App';

test('renders without crashing', () => {
  render(<App />);
  // The app should render the BookVerse brand name
  expect(screen.getAllByText(/bookverse/i).length).toBeGreaterThan(0);
});
