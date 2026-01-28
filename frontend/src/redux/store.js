import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
// Configure Redux store
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    // We will add more reducers here (auth, blogs, etc.)
  },
});
