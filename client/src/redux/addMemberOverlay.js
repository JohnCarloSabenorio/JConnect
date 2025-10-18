import { createSlice } from "@reduxjs/toolkit";

const addMemberOverlaySlice = createSlice({
  name: "addMemberOverlay",
  initialState: {
    hideAddMemberOverlay: true,
    selectedUsers: [],
  },

  reducers: {
    setHideAddMemberOverlay: (state, action) => {
      state.hideAddMemberOverlay = action.payload;
      state.selectedUsers = [];
    },
    addSelectedUser: (state, action) => {
      let updatedSelectedUsers = state.selectedUsers;
      updatedSelectedUsers.push(action.payload);

      state.selectedUsers = updatedSelectedUsers;
    },

    setSelectedUsers: (state, action) => {
      state.selectedUsers = [];
    },

    removeSelectedUser: (state, action) => {
      let updatedSelectedUsers = JSON.parse(
        JSON.stringify(state.selectedUsers)
      );

      updatedSelectedUsers = updatedSelectedUsers.filter(
        (user) => user._id !== action.payload
      );

      state.selectedUsers = updatedSelectedUsers;
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
