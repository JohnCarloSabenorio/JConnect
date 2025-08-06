import { createSlice } from "@reduxjs/toolkit";

const CreateGroupChatOverlaySlice = createSlice({
  name: "createGroupChatOverlay",
  initialState: {
    displayGroupChatOverlay: false,
  },
  reducers: {
    setDisplayGroupChatOverlay: (state, action) => {
      state.displayGroupChatOverlay = action.payload;
    },
  },
});

export const { setDisplayGroupChatOverlay } =
  CreateGroupChatOverlaySlice.actions;

export default CreateGroupChatOverlaySlice.reducer;
