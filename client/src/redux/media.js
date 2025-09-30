import { createSlice } from "@reduxjs/toolkit";

const mediaSlice = createSlice({
  name: "media",
  initialState: {
    mediaImages: [],
    mediaFiles: [],
    displayMediaPanel: true,
    activeMemberMenuId: "",
  },
  reducers: {
    setMediaImages: (state, action) => {
      state.mediaImages = action.payload;
    },
    setMediaFiles: (state, action) => {
      state.mediaFiles = action.payload;
    },

    addToMediaImages: (state, action) => {
      state.mediaImages = [...state.mediaImages, ...action.payload];
    },
    addToMediaFiles: (state, action) => {
      state.mediaFiles = [...state.mediaFiles, ...action.payload];
    },

    toggleMediaPanel: (state, action) => {
      state.displayMediaPanel = !state.displayMediaPanel;
    },

    setActiveMemberMenuId: (state, action) => {
      state.activeMemberMenuId = action.payload;
    },
  },
});

export const {
  setMediaImages,
  setMediaFiles,
  toggleMediaPanel,
  setActiveMemberMenuId,
} = mediaSlice.actions;

export default mediaSlice.reducer;
