import { configureStore } from '@reduxjs/toolkit';

import themeReducer from './slices/themeSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import favoritesReducer from './slices/favoritesSlice';
import categoryReducer from './slices/categorySlice'
import ordersReducer from './slices/orderSlice'
import paymentReducer from './slices/paymentSlice'
import settingsReducer from './slices/settingsSlice'
import messagesReducer from './slices/messageSlice'

export const store = configureStore({
  reducer: {
    theme:  themeReducer,
    cart: cartReducer,
    auth: authReducer,
    category: categoryReducer,
    products: productsReducer,
    order: ordersReducer,
    payment: paymentReducer,
    favorites:  favoritesReducer,
    settings:  settingsReducer,
    messages:  messagesReducer,
  },
 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;