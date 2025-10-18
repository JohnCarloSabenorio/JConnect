import { createSlice } from "@reduxjs/toolkit";
import { getFriends } from "../api/friends";

const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    allFriends: [],
    allNonFriends: [],
    activeChatmateId: "",
  },

  reducers: {
    setAllFriends: (state, action) => {
      state.allFriends = action.payload;
    },
    setAllNonFriends: (state, action) => {},
    setActiveChatmateId: (state, action) => {
      state.activeChatmateId = action.payload;
    },
    updateFriendStatus: (state, action) => {
      state.allFriends = state.allFriends.map((data) => {
        if (data.friend._id == action.payload[0]) {
          data.friend.status = action.payload[1];
        }
        return data;
      });
    },
  },
});

export const {
  setAllFriends,
  setAllNonFriends,
  updateFriendStatus,
  setActiveChatmateId,
} = friendsSlice.actions;

export default friendsSlice.reducer;
