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

    updateFriendStatus: (state, action) => {
      state.allFriends = state.allFriends.map((data) => {
        if (data.friend._id == action.payload[0]) {
          console.log("FRIEND IS MATCHED");
          console.log("NEW STATUS:", action.payload[1]);
          console.log("the data:", data);
          data.friend.status = action.payload[1];
        }
        return data;
      });
    },
  },
});

export const { setAllFriends, setAllNonFriends, updateFriendStatus } =
  friendsSlice.actions;

export default friendsSlice.reducer;
