import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (book) => {
        const existing = get().cart.find((i) => i.id === book.id);
        if (existing) {
          set({ cart: get().cart.map((i) => i.id === book.id ? { ...i, qty: i.qty + 1 } : i) });
        } else {
          set({ cart: [...get().cart, { ...book, qty: 1 }] });
        }
      },
      removeFromCart: (id) => set({ cart: get().cart.filter((i) => i.id !== id) }),
      updateQty: (id, qty) => {
        if (qty < 1) { get().removeFromCart(id); return; }
        set({ cart: get().cart.map((i) => i.id === id ? { ...i, qty } : i) });
      },
      clearCart: () => set({ cart: [] }),

      // User / Auth
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Order history
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),

      // Gift points
      giftPoints: 150,
      redeemPoints: (pts) => set({ giftPoints: Math.max(0, get().giftPoints - pts) }),

      // Wishlist
      wishlist: [],
      toggleWishlist: (book) => {
        const exists = get().wishlist.find((b) => b.id === book.id);
        set({ wishlist: exists ? get().wishlist.filter((b) => b.id !== book.id) : [...get().wishlist, book] });
      },
    }),
    { name: 'ebook-store' }
  )
);

export default useStore;
