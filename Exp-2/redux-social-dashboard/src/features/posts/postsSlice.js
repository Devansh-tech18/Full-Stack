import { createSlice, nanoid } from '@reduxjs/toolkit';

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
      // Now accepts platform as a third argument
      prepare(title, content, platform) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            platform
          }
        };
      }
    }
  }
});

export const { postAdded } = postsSlice.actions;
export default postsSlice.reducer;