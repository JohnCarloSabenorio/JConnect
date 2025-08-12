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
    targetScrollMessageId: "",
    initialRender: true,
  },

  reducers: {
    initDisplayedMessages: (state, action) => {
      state.displayedMessages = action.payload;
    },

    setInitialMessageRender: (state, action) => {
      state.initialRender = action.payload;
    },

    updateMessage: (state, action) => {
      state.displayedMessages = state.displayedMessages.map((msg) =>
        msg._id === action.payload._id ? action.payload : msg
      );
    },

    setTargetScrollMessageId: (state, action) => {
      state.targetScrollMessageId = action.payload;
    },

    setMessageIsLoading: (state, action) => {
      state.messageIsLoading = action.payload;
    },

    updateDisplayedMessages: (state, action) => {
      console.log("updating displayed messages");
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
  setInitialMessageRender,
  updateDisplayedMessages,
  updateMessage,
  setMessageIsLoading,
  setDisplayChatReact,
  setMessageReactionsId,
  setDisplayReactionsOverlay,
  setAllMessageReactions,
  setDisplayedUserReactions,
  setDisplayedEmoji,
  setTargetScrollMessageId,
} = messageSlice.actions;

export default messageSlice.reducer;
