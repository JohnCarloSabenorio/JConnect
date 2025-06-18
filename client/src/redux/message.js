import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    displayedMessages: [],
    messageIsLoading: true,
    displayChatReact: false,
  },

  reducers: {
    initDisplayedMessages: (state, action) => {
      state.displayedMessages = action.payload;
    },

    setMessageIsLoading: (state, action) => {
      state.messageIsLoading = action.payload;
    },

    updateDisplayedMessages: (state, action) => {
      state.displayedMessages = [...state.displayedMessages, action.payload];
    },

    setDisplayChatReact: (state, action) => {
      state.displayChatReact = action.payeload;
    },
  },
});

export const {
  initDisplayedMessages,
  updateDisplayedMessages,
  setMessageIsLoading,
  setDisplayChatReact,
} = messageSlice.actions;

export default messageSlice.reducer;
