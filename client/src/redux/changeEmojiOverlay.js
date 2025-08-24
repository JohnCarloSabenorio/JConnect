import { createSlice } from "@reduxjs/toolkit";

const changeEmojiSlice = createSlice({
  name: "changeEmojiOverlay",
  initialState: {
    displayChangeEmojiOverlay: false,
  },

  reducers: {
    setDisplayChangeEmojiOverlay: (state, action) => {
      state.displayChangeEmojiOverlay = action.payload;
    },
  },
});

export const { setDisplayChangeEmojiOverlay } = changeEmojiSlice.actions;

export default changeEmojiSlice.reducer;
