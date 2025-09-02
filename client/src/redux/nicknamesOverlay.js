import { createSlice } from "@reduxjs/toolkit";
const nicknamesOverlaySlice = createSlice({
  name: "nicknamesOverlay",
  initialState: {
    displayNicknamesOverlay: false,
    namesAndNicknames: [],
  },

  reducers: {
    setDisplayNicknamesOverlay: (state, action) => {
      state.displayNicknamesOverlay = action.payload;
    },
    setNamesAndNicknames: (state, action) => {
      state.namesAndNicknames = action.payload;
    },
    updateANickname: (state, action) => {
      state.namesAndNicknames[action.payload[0]].nickname = action.payload[1];
    },
  },
});

export const {
  setDisplayNicknamesOverlay,
  setNamesAndNicknames,
  updateANickname,
} = nicknamesOverlaySlice.actions;

export default nicknamesOverlaySlice.reducer;
