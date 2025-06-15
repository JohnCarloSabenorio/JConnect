import { createSlice } from "@reduxjs/toolkit";

const addMemberOverlaySlice = createSlice({
  name: "addMemberOverlay",
  initialState: {
    hideAddMemberOverlay: true,
    selectedUsers: [],
  },

  reducers: {
    setHideAddMemberOverlay: (state, action) => {
      console.log("HIDE ADDMEMBER OVERLAY?", action.payload);
      state.hideAddMemberOverlay = action.payload;
    },
    addSelectedUser: (state, action) => {
      let updatedSelectedUsers = state.selectedUsers;
      updatedSelectedUsers.push(action.payload);

      state.selectedUsers = updatedSelectedUsers;

      console.log(
        "Selected users updated:",
        JSON.parse(JSON.stringify(updatedSelectedUsers))
      );
    },

    removeSelectedUser: (state, action) => {
      let updatedSelectedUsers = JSON.parse(
        JSON.stringify(state.selectedUsers)
      );

      updatedSelectedUsers = updatedSelectedUsers.filter(
        (user) => user._id !== action.payload
      );

      state.selectedUsers = updatedSelectedUsers;
      console.log("Selected users updated:", updatedSelectedUsers);
    },
  },
});

export const {
  setHideAddMemberOverlay,
  setSelectedUsers,
  addSelectedUser,
  removeSelectedUser,
} = addMemberOverlaySlice.actions;

export default addMemberOverlaySlice.reducer;
