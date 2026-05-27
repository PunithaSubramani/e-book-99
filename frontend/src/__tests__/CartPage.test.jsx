import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-hot-toast', () => ({ success: jest.fn(), __esModule: true, default: jest.fn() }));

// Default mock: empty cart
jest.mock('../store/useStore', () => () => ({
  cart: [],
  removeFromCart: jest.fn(),
  updateQty: jest.fn(),
  orders: [],
  addToCart: jest.fn(),
}));

import CartPage from '../pages/CartPage';

describe('CartPage — empty cart', () => {
  it('shows empty cart message', () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('shows Browse Books link', () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    expect(screen.getByText(/browse books/i)).toBeInTheDocument();
  });
});
