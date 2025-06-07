import { createSlice } from "@reduxjs/toolkit";

const mediaSlice = createSlice({
  name: "media",
  initialState: {
    mediaImages: [],
    displayMediaPanel: true,
  },
  reducers: {
    setMediaImages: (state, action) => {
      state.mediaImages = action.payload;
    },

    toggleMediaPanel: (state, action) => {
      state.displayMediaPanel = !state.displayMediaPanel;
    },
  },
});

export const { setMediaImages, toggleMediaPanel } = mediaSlice.actions;

export default mediaSlice.reducer;
