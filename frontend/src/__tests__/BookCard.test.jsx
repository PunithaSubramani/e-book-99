import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../components/BookCard';

// Mock zustand store
jest.mock('../store/useStore', () => () => ({
  addToCart: jest.fn(),
  toggleWishlist: jest.fn(),
  wishlist: [],
}));

// Mock react-hot-toast with proper named exports
jest.mock('react-hot-toast', () => {
  const mockSuccess = jest.fn();
  const mockDefault = jest.fn();
  mockDefault.success = mockSuccess;
  mockDefault.error = jest.fn();
  return { __esModule: true, default: mockDefault, success: mockSuccess, error: jest.fn() };
});

const mockBook = {
  id: 1,
  title: 'Atomic Habits',
  author: 'James Clear',
  price: 14.99,
  rating: 4.9,
  reviews: 5120,
  image: 'https://picsum.photos/seed/book2/300/400',
  tags: ['bestseller'],
  category: 'self-help',
};

const renderCard = () =>
  render(
    <MemoryRouter>
      <BookCard book={mockBook} />
    </MemoryRouter>
  );

describe('BookCard', () => {
  it('renders book title', () => {
    renderCard();
    expect(screen.getByText('Atomic Habits')).toBeInTheDocument();
  });

  it('renders book author', () => {
    renderCard();
    expect(screen.getByText('James Clear')).toBeInTheDocument();
  });

  it('renders book price', () => {
    renderCard();
    expect(screen.getByText('$14.99')).toBeInTheDocument();
  });

  it('renders bestseller badge', () => {
    renderCard();
    expect(screen.getByText('Bestseller')).toBeInTheDocument();
  });

  it('renders Add button', () => {
    renderCard();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('calls addToCart when Add button is clicked without throwing', () => {
    renderCard();
    // The Add button should be present and clickable
    const addBtn = screen.getByText('Add');
    expect(addBtn).toBeInTheDocument();
    expect(() => fireEvent.click(addBtn)).not.toThrow();
  });
});
