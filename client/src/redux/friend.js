import { createSlice } from "@reduxjs/toolkit";
import { getFriends } from "../api/friends";

const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    allFriends: [],
  },

  reducers: {
    setAllFriends: (state, action) => {
      console.log("ALL FRIENDS:");
      console.log(action.payload);
      state.allFriends = action.payload;
    },
  },
});

export const { setAllFriends } = friendsSlice.actions;

export default friendsSlice.reducer;
