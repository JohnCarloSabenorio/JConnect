import { createSlice } from "@reduxjs/toolkit";

const editProfileOverlaySlice = createSlice({
  name: "editProfileOverlay",
  initialState: {
    displayEditProfileOverlay: false,
  },
  reducers: {
    setEditDisplayProfileOverlay: (state, action) => {
      state.displayEditProfileOverlay = action.payload;
    },
  },
});

export const { setEditDisplayProfileOverlay } = editProfileOverlaySlice.actions;

export default editProfileOverlaySlice.reducer;
