import { createSlice } from "@reduxjs/toolkit";
const nicknamesOverlaySlice = createSlice({
  name: "nicknamesOverlay",
  initialState: {
    displayNicknamesOverlay: false,
  },

  reducers: {
    setDisplayNicknamesOverlay: (state, action) => {
      state.displayNicknamesOverlay = action.payload;
    },
  },
});

export const { setDisplayNicknamesOverlay } = nicknamesOverlaySlice.actions;

export default nicknamesOverlaySlice.reducer;
