import { createSlice } from "@reduxjs/toolkit";

const mediaSlice = createSlice({
  name: "media",
  initialState: {
    mediaImages: [],
  },
  reducers: {
    setMediaImages: (state, action) => {
      state.mediaImages = action.payload;
    },
  },
});

export const { setMediaImages } = mediaSlice.actions;

export default mediaSlice.reducer;
