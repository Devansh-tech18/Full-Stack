import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  content: '',
  selectedPlatforms: [],
};

export const composerSlice = createSlice({
  name: 'composer',
  initialState,
  reducers: {
    setContent: (state, action) => {
      state.content = action.payload;
    },
    togglePlatform: (state, action) => {
      const platform = action.payload;
      if (state.selectedPlatforms.includes(platform)) {
        state.selectedPlatforms = state.selectedPlatforms.filter(p => p !== platform);
      } else {
        state.selectedPlatforms.push(platform);
      }
    },
    clearComposer: (state) => {
      state.content = '';
      state.selectedPlatforms = [];
    }
  },
});

export const { setContent, togglePlatform, clearComposer } = composerSlice.actions;
export default composerSlice.reducer;