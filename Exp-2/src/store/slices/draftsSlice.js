import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  drafts: [],
};

export const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    saveDraft: (state, action) => {
      state.drafts.push({
        id: Date.now(),
        ...action.payload,
        createdAt: new Date().toISOString()
      });
    },
    deleteDraft: (state, action) => {
      state.drafts = state.drafts.filter(draft => draft.id !== action.payload);
    },
  },
});

export const { saveDraft, deleteDraft } = draftsSlice.actions;
export default draftsSlice.reducer;