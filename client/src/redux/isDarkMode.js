import { createSlice } from "@reduxjs/toolkit";

const isDarkModeSlice = createSlice({
  name: "isDarkMode",
  initialState: {
    isDarkMode: false,
  },

  reducers: {
    toggleDarkMode: (state, action) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleDarkMode } = isDarkModeSlice.actions;

export default isDarkModeSlice.reducer;
