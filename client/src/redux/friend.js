import { createSlice } from "@reduxjs/toolkit";
import { getFriends } from "../api/friends";

const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    allFriends: [],
    allNonFriends: [],
  },

  reducers: {
    setAllFriends: (state, action) => {
      console.log("ALL FRIENDS:", action.payload);
      state.allFriends = action.payload;
    },
    setAllNonFriends: (state, action) => {
      console.log("ALL NON FRIENDS:", action.payload);
    },
  },
});

export const { setAllFriends, setAllNonFriends } = friendsSlice.actions;

export default friendsSlice.reducer;
