import { createSlice, nanoid, createSelector } from '@reduxjs/toolkit';

const initialState = [
  { id: '1', title: 'Learning Redux Toolkit', content: 'I have heard good things.', platform: 'Twitter' },
  { id: '2', title: 'Slices...', content: 'The more I say slice, the more I want pizza.', platform: 'LinkedIn' }
];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(title, content, platform) {
        return {
          payload: { id: nanoid(), title, content, platform }
        };
      }
    },
    postDeleted(state, action) {
      const idToRemove = action.payload;
      return state.filter(post => post.id !== idToRemove);
    }
  }
});

export const { postAdded, postDeleted } = postsSlice.actions;

// --- EXPERIMENT 3: MEMOIZED SELECTORS ---

// 1. Basic Selector
export const selectAllPosts = (state) => state.posts;

// 2. Memoized Selector (Computes derived data efficiently)
export const selectPostsByPlatform = createSelector(
  [selectAllPosts, (state, platform) => platform],
  (posts, platform) => {
    if (platform === 'All') return posts;
    return posts.filter(post => post.platform === platform);
  }
);

export default postsSlice.reducer;