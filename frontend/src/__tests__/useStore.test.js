// Test the Zustand store logic directly
const { act } = require('@testing-library/react');

// We test the store logic by importing and calling actions
describe('useStore cart logic', () => {
  let useStore;

  beforeEach(() => {
    jest.resetModules();
    // Mock zustand persist to avoid localStorage issues in tests
    jest.mock('zustand/middleware', () => ({
      persist: (fn) => fn,
    }));
    jest.mock('zustand', () => {
      const { create } = jest.requireActual('zustand');
      return { create };
    });
    useStore = require('../store/useStore').default;
  });

  const book1 = { id: 1, title: 'Atomic Habits', price: 14.99, category: 'self-help' };
  const book2 = { id: 2, title: 'Sapiens', price: 13.99, category: 'history' };

  it('adds item to cart', () => {
    const { addToCart, cart } = useStore.getState();
    addToCart(book1);
    expect(useStore.getState().cart).toHaveLength(1);
    expect(useStore.getState().cart[0].qty).toBe(1);
  });

  it('increments qty when same item added again', () => {
    useStore.setState({ cart: [] });
    const { addToCart } = useStore.getState();
    addToCart(book1);
    addToCart(book1);
    expect(useStore.getState().cart[0].qty).toBe(2);
  });

  it('removes item from cart', () => {
    useStore.setState({ cart: [{ ...book1, qty: 1 }] });
    useStore.getState().removeFromCart(1);
    expect(useStore.getState().cart).toHaveLength(0);
  });

  it('clears cart', () => {
    useStore.setState({ cart: [{ ...book1, qty: 1 }, { ...book2, qty: 2 }] });
    useStore.getState().clearCart();
    expect(useStore.getState().cart).toHaveLength(0);
  });

  it('toggles wishlist on/off', () => {
    useStore.setState({ wishlist: [] });
    useStore.getState().toggleWishlist(book1);
    expect(useStore.getState().wishlist).toHaveLength(1);
    useStore.getState().toggleWishlist(book1);
    expect(useStore.getState().wishlist).toHaveLength(0);
  });

  it('redeems gift points', () => {
    useStore.setState({ giftPoints: 150 });
    useStore.getState().redeemPoints(50);
    expect(useStore.getState().giftPoints).toBe(100);
  });

  it('does not go below 0 gift points', () => {
    useStore.setState({ giftPoints: 30 });
    useStore.getState().redeemPoints(100);
    expect(useStore.getState().giftPoints).toBe(0);
  });
});
