import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import postsSlice from './slices/postsSlice';
import analyticsSlice from './slices/analyticsSlice';
import socialSetsSlice from './slices/socialSetsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    analytics: analyticsSlice,
    socialSets: socialSetsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['posts/setPosts'],
        ignoredPaths: ['analytics.dateRange.start', 'analytics.dateRange.end'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;