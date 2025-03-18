import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

store.subscribe(() => {
  try {
    const cartState = store.getState().cart;
    localStorage.setItem('cart', JSON.stringify(cartState));
  } catch (err) {
    console.error('Error saving cart to localStorage:', err);
  }
});

export default store;