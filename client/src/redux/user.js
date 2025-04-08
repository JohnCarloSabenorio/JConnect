import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    allUsers: [],
  },

  reducers: {
    setAllUsers: (state, action) => {
      console.log("ALL USERS KEK", action.payload);
      state.allUsers = action.payload;
    },
  },
});

export const { setAllUsers } = userSlice.actions;

export default userSlice.reducer;
