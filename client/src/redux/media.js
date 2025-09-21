import { createSlice } from "@reduxjs/toolkit";

const mediaSlice = createSlice({
  name: "media",
  initialState: {
    mediaImages: [],
    displayMediaPanel: true,
    activeMemberMenuId: "",
  },
  reducers: {
    setMediaImages: (state, action) => {
      state.mediaImages = action.payload;
    },

    addToMediaImages: (state, action) => {
      state.mediaImages = [...state.mediaImages, ...action.payload];
    },

    toggleMediaPanel: (state, action) => {
      state.displayMediaPanel = !state.displayMediaPanel;
    },

    setActiveMemberMenuId: (state, action) => {
      state.activeMemberMenuId = action.payload;
    },
  },
});

export const { setMediaImages, toggleMediaPanel, setActiveMemberMenuId } =
  mediaSlice.actions;

export default mediaSlice.reducer;
