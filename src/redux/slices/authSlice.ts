import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const getCachedUser = (): User | null => {
  try {
    const cached = localStorage.getItem('auth_user');
    return cached ? (JSON.parse(cached) as User) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getCachedUser(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = { ...action.payload, isLoggedIn: true } as User;
      state.isLoading = false;
      state.error = null;
      try {
        localStorage.setItem('auth_user', JSON.stringify(state.user));
      } catch {
        // ignore
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      try {
        localStorage.removeItem('auth_user');
      } catch {
        // ignore
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart, 
  registerSuccess, 
  registerFailure, 
  logout, 
  clearError 
} = authSlice.actions;
export default authSlice.reducer;