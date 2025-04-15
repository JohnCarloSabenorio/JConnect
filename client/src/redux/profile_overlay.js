import { createSlice } from "@reduxjs/toolkit";

const profileOverlaySlice = createSlice({
  name: "profileOverlay",
  initialState: {
    isDisplayed: false,
    displayedUser: null,
  },
  reducers: {
    hideProfileOverlay: (state, action) => {
      state.isDisplayed = false;
    },
    showProfileOverlay: (state, action) => {
      state.isDisplayed = true;
    },

    setDisplayedUser: (state, action) => {
      state.displayedUser = action.payload;
    },
  },
});

export const { hideProfileOverlay, showProfileOverlay, setDisplayedUser } =
  profileOverlaySlice.actions;

export default profileOverlaySlice.reducer;
