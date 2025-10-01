import { createSlice } from "@reduxjs/toolkit";

const overlaySlice = createSlice({
  name: "overlay",
  initialState: {
    isHidden: true,
    displayBlockOverlay: false,
  },

  reducers: {
    setIsHidden: (state, action) => {
      state.isHidden = !state.isHidden;
    },

    setDisplayBlockOverlay: (state, action) => {
      state.displayBlockOverlay = action.payload;
    },
  },
});

export const { setIsHidden, setDisplayBlockOverlay } = overlaySlice.actions;

export default overlaySlice.reducer;
