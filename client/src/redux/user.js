import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    allUsers: [],
  },

  reducers: {
    setAllUsers: (state, action) => {
      console.log("ALL USERS IN THE WEBSITE", action.payload);
      state.allUsers = action.payload;
    },
  },
});

export const { setAllUsers, getUser } = userSlice.actions;

export default userSlice.reducer;
