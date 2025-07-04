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
    collectedReactions: [],
    displayedEmoji: "all_emoji",
    displayedUserReactions: [],
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

      let collectedArr = [];

      for (const unifiedEmoji in state.allMessageReactions) {
        collectedArr = collectedArr.concat(
          state.allMessageReactions[unifiedEmoji]
        );
      }
      state.collectedReactions = collectedArr;

      state.displayedUserReactions = collectedArr;
    },

    setDisplayedUserReactions: (state, action) => {
      state.displayedUserReactions = action.payload;
    },

    setDisplayedEmoji: (state, action) => {
      state.displayedEmoji = action.payload;
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
  setDisplayedUserReactions,
  setDisplayedEmoji,
} = messageSlice.actions;

export default messageSlice.reducer;
