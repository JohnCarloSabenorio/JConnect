import { createSlice } from "@reduxjs/toolkit";

const mediaSlice = createSlice({
  name: "media",
  initialState: {
    mediaImages: [],
    mediaFiles: [],
    displayMediaPanel: false,
    displayCloseMediaBtn: false,
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

    setDisplayMediaPanel: (state, action) => {
      state.displayMediaPanel = action.payload;
    },

    setDisplayCloseMediaBtn: (state, action) => {
      state.displayCloseMediaBtn = action.payload;
    },

    setActiveMemberMenuId: (state, action) => {
      state.activeMemberMenuId = action.payload;
    },
  },
});

export const {
  setDisplayCloseMediaBtn,
  setMediaImages,
  addToMediaFiles,
  addToMediaImages,
  setMediaFiles,
  toggleMediaPanel,
  setDisplayMediaPanel,
  setActiveMemberMenuId,
} = mediaSlice.actions;

export default mediaSlice.reducer;
