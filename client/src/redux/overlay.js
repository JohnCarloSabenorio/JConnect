import { createSlice } from "@reduxjs/toolkit";

const overlaySlice = createSlice({
  name: "overlay",
  initialState: {
    isHidden: true,
  },

  reducers: {
    setIsHidden: (state, action) => {
      state.isHidden = !state.isHidden;
    },
  },
});

export const { setIsHidden } = overlaySlice.actions;

export default overlaySlice.reducer;
