import { createSlice } from "@reduxjs/toolkit";

const settingsOverlaySlice = createSlice({
  name: "settingsOverlay",
  initialState: {
    displaySettingsOverlay: false,
  },

  reducers: {
    setDisplaySettingsOverlay: (state, action) => {
      state.displaySettingsOverlay = action.payload;
    },
  },
});

export const { setDisplaySettingsOverlay } = settingsOverlaySlice.actions;

export default settingsOverlaySlice.reducer;
