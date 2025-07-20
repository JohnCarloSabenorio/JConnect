import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversationName: "ConName",
    messageInput: "",
    emojiPickerIsOpen: false,
  },
  reducers: {
    setConversationName: (state, action) => {
      state.conversationName = action.payload;
    },

    setEmojiPickerIsOpen: (state, action) => {
      state.emojiPickerIsOpen = action.payload;
    },
  },
});

export const { setConversationName, setMessageInput, setEmojiPickerIsOpen } =
  chatSlice.actions;

export default chatSlice.reducer;
