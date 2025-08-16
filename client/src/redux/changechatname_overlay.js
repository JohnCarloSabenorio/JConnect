import { createSlice } from "@reduxjs/toolkit";

const changeChatNameSlice = createSlice({
  name: "ChangeChatName",
  initialState: {
    changeChatNameOverlayIsOpen: false,
  },
  reducers: {
    setChangeChatNameOverlayIsOpen: (state, action) => {
      state.changeChatNameOverlayIsOpen = action.payload;
    },
  },
});

export const { setChangeChatNameOverlayIsOpen } = changeChatNameSlice.actions;

export default changeChatNameSlice.reducer;
