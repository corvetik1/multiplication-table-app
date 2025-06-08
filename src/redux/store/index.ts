import { configureStore } from '@reduxjs/toolkit';
import multiplicationReducer from '../features/multiplicationSlice';

export const store = configureStore({
  reducer: {
    multiplication: multiplicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
