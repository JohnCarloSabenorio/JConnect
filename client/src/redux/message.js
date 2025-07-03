import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    displayedMessages: [],
    messageIsLoading: true,
    displayChatReact: false,
    messageReactionsId: "",
    displayReactionsOverlay: false,
    allMessageReactions: {},
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
      state.displayChatReact = action.payload;
    },

    setMessageReactionsId: (state, action) => {
      state.messageReactionsId = action.payload;
    },

    setDisplayReactionsOverlay: (state, action) => {
      state.displayReactionsOverlay = action.payload;
    },

    setAllMessageReactions: (state, action) => {
      state.allMessageReactions = action.payload;
    },
  },
});

export const {
  initDisplayedMessages,
  updateDisplayedMessages,
  setMessageIsLoading,
  setDisplayChatReact,
  setMessageReactionsId,
  setDisplayReactionsOverlay,
  setAllMessageReactions,
} = messageSlice.actions;

export default messageSlice.reducer;
