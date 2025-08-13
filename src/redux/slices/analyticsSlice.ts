import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalyticsData } from '../../types';

interface AnalyticsState {
  data: AnalyticsData[];
  isLoading: boolean;
  error: string | null;
  dateRange: {
    start: string; // Store as ISO string
    end: string;   // Store as ISO string
  };
}

const initialState: AnalyticsState = {
  data: [],
  isLoading: false,
  error: null,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    end: new Date().toISOString(),
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData: (state, action: PayloadAction<AnalyticsData[]>) => {
      state.data = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.dateRange = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAnalyticsData, setDateRange, setLoading, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;