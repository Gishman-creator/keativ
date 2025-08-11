import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocialSet } from '../../types';

interface SocialSetsState {
  socialSets: SocialSet[];
  activeSocialSet: SocialSet | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SocialSetsState = {
  socialSets: [],
  activeSocialSet: null,
  isLoading: false,
  error: null,
};

const socialSetsSlice = createSlice({
  name: 'socialSets',
  initialState,
  reducers: {
    setSocialSets: (state, action: PayloadAction<SocialSet[]>) => {
      state.socialSets = action.payload;
    },
    setActiveSocialSet: (state, action: PayloadAction<SocialSet>) => {
      state.activeSocialSet = action.payload;
    },
    addSocialSet: (state, action: PayloadAction<SocialSet>) => {
      state.socialSets.push(action.payload);
    },
    updateSocialSet: (state, action: PayloadAction<SocialSet>) => {
      const index = state.socialSets.findIndex(set => set.id === action.payload.id);
      if (index !== -1) {
        state.socialSets[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSocialSets,
  setActiveSocialSet,
  addSocialSet,
  updateSocialSet,
  setLoading,
  setError
} = socialSetsSlice.actions;
export default socialSetsSlice.reducer;