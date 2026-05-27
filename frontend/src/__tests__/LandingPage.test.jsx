import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

jest.mock('../store/useStore', () => () => ({
  addToCart: jest.fn(),
  toggleWishlist: jest.fn(),
  wishlist: [],
}));

jest.mock('react-hot-toast', () => ({ success: jest.fn(), __esModule: true, default: jest.fn() }));

describe('LandingPage', () => {
  it('renders the hero heading', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByText(/discover your next/i)).toBeInTheDocument();
  });

  it('renders Browse Books button', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByText(/browse books/i)).toBeInTheDocument();
  });

  it('renders Bestsellers section heading', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    // Use getAllByText since "Bestsellers" appears in heading and footer link
    const elements = screen.getAllByText('Bestsellers');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('renders New Arrivals section heading', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    const elements = screen.getAllByText('New Arrivals');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('renders category buttons', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
  });

  it('renders footer copyright', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByText(/2026 bookverse/i)).toBeInTheDocument();
  });
});
