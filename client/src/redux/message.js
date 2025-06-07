import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    displayedMessages: [],
    messageIsLoading: true,
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
  },
});

export const {
  initDisplayedMessages,
  updateDisplayedMessages,
  setMessageIsLoading,
} = messageSlice.actions;

export default messageSlice.reducer;
