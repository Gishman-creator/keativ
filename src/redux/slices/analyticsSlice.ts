import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalyticsData } from '../../types';

interface AnalyticsState {
  data: AnalyticsData[];
  isLoading: boolean;
  error: string | null;
  dateRange: {
    start: Date;
    end: Date;
  };
}

const initialState: AnalyticsState = {
  data: [],
  isLoading: false,
  error: null,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData: (state, action: PayloadAction<AnalyticsData[]>) => {
      state.data = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ start: Date; end: Date }>) => {
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