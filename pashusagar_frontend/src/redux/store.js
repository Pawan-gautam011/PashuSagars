import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import medicineReducer from "./medicineSlice"

const store = configureStore({
  reducer: {
    cart: cartReducer,
    medicines: medicineReducer,
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