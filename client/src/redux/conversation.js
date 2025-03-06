import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    currentConvoName: "",
    activeConvo: null,
    activeConvoIsGroup: false,
    allUserConvo: null,
    activeConvoMembers: null,
    allUserGroupConvo: null,
    allUserArchivedConvo: null,
    activeDirectUser: null,
    userIsFriend: true,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      console.log("THE ACTIVE CONVO PAYLOAD:", action.payload);

      state.currentConvoName = action.payload[0];
      state.activeConvo = action.payload[1];
    },
    setCurrentConvoName: (state, action) => {
      state.currentConvoName = action.payload;
    },

    setActiveConvo: (state, action) => {
      state.activeConvo = action.payload;
      console.log("ACTIVE CONVERSATION:");
      console.log(action.payload);
    },

    setActiveConvoMembers: (state, action) => {
      state.activeConvoMembers = action.payload;
    },

    setActiveDirectUser: (state, action) => {
      console.log("ACTIVE DIRECT FRIEND:", action.payload);
      state.activeDirectUser = action.payload;
    },

    setUserIsFriend: (state, action) => {
      state.userIsFriend = action.payload;
    },

    setActiveConvoIsGroup: (state, action) => {
      state.activeConvoIsGroup = action.payload;
      state.userIsFriend = false;
      state.activeDirectUser = null;
    },

    initDirectsAndGroups: (state, action) => {
      state.allUserConvo = action.payload[0];
      console.log("THE PAKING PAYLOAD:", action.payload);
      state.allUserGroupConvo = action.payload[1];
    },
    initAllUserConvo: (state, action) => {
      state.allUserConvo = action.payload[0];
      state.allUserGroupConvo = action.payload[1];
      state.allUserArchivedConvo = action.payload[2];
    },
    initAllUserGroupConvo: (state, action) => {
      state.allUserGroupConvo = action.payload;
    },
    updateAGroupConvo: (state, action) => {
      state.allUserGroupConvo = [
        ...state.allUserGroupConvo.map((convo) =>
          convo._id === action.payload.convo._id ? action.payload.convo : convo
        ),
      ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },

    addANewConvo: (state, action) => {
      state.allUserConvo = [action.payload, ...state.allUserConvo];
    },

    updateAConvo: (state, action) => {
      // this will find the existing conversation and update it with the new one
      state.allUserConvo = [
        ...state.allUserConvo.map((convo) =>
          convo._id === action.payload.convo._id ? action.payload.convo : convo
        ),
      ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },
  },
});

export const {
  setActiveConversation,
  setCurrentConvoName,
  setActiveConvo,
  setActiveConvoIsGroup,
  setActiveDirectUser,
  setUserIsFriend,
  initDirectsAndGroups,
  initAllUserConvo,
  initAllUserGroupConvo,
  updateAGroupConvo,
  setActiveConvoMembers,
  addANewConvo,
  updateAConvo,
} = conversationSlice.actions;

export default conversationSlice.reducer;
