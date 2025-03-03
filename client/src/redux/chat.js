import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversationName: "ConName",
    messageInput: "",
  },
  reducers: {
    setConversationName: (state, action) => {
      state.conversationName = action.payload;
    },
  },
});

export const { setConversationName, setMessageInput } = chatSlice.actions;

export default chatSlice.reducer;
