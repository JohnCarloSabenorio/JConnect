import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    displayedMessages: [],
  },

  reducers: {
    initDisplayedMessages: (state, action) => {
      state.displayedMessages = action.payload;
    },

    updateDisplayedMessages: (state, action) => {
      state.displayedMessages = [
        ...state.displayedMessages,
        action.payload,
      ];
    },
  },
});

export const { initDisplayedMessages, updateDisplayedMessages } = messageSlice.actions;

export default messageSlice.reducer;
