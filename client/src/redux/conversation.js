import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    currentConvoName: "",
    activeUserConvo: null,
    activeConvo: null,
    activeConvoArrayId: null,
    activeConvoIsGroup: false,
    activeConvoIsArchived: false,
    allInboxConversation: null,
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

    filterArchivedConvo: (state, action) => {
      // Removes the archived direct conversation
      state.allInboxConversation = state.allInboxConversation.filter(
        (userConversation) => {
          // If the convoId matches, exclude it in the direct conversation list
          if (userConversation.conversation._id === action.payload) {
            state.allUserArchivedConvo.push(userConversation);

            return false;
          }

          // If it doesn't match, keep the conversation in the direct conversation list
          return true;
        }
      );
    },
    filterRestoredConvo: (state, action) => {
      state.allUserArchivedConvo = state.allUserArchivedConvo.filter(
        (userConversation) => {
          if (userConversation.conversation._id === action.payload) {
            state.allInboxConversation.push(userConversation);
            // If the convoId matches, add it in the direct conversation list
            return false;
          }
          // If it doesn't match, keep the conversation in the archived conversation list
          return true;
        }
      );
    },
    setActiveConvoArrayId: (state, action) => {
      state.activeConvoArrayId = action.payload;
    },

    setActiveConvoMembers: (state, action) => {
      state.activeConvoMembers = action.payload;
    },

    setActiveDirectUser: (state, action) => {
      console.log("ACTIVE DIRECT FRIEND:", action.payload);
      state.activeDirectUser = action.payload;
    },

    setUserIsFriend: (state, action) => {
      console.log(
        "UPDATED STATE OF THE USER.. IS IT A FRIEND?",
        action.payload
      );
      state.userIsFriend = action.payload;
    },

    setActiveConvoIsGroup: (state, action) => {
      state.activeConvoIsGroup = action.payload;
      state.userIsFriend = false;
      state.activeDirectUser = null;
    },
    setActiveConvoIsArchived: (state, action) => {
      state.activeConvoIsArchived = action.payload;
    },

    initDirectsAndGroups: (state, action) => {
      state.allInboxConversation = action.payload[0];
      state.allUserGroupConvo = action.payload[1];
    },
    initAllUserConversation: (state, action) => {
      state.allInboxConversation = action.payload[0];
      state.allUserGroupConvo = action.payload[1];
      state.allUserArchivedConvo = action.payload[2];
    },
    initAllUserGroupConvo: (state, action) => {
      state.allUserGroupConvo = action.payload;
    },
    updateAGroupConvo: (state, action) => {
      state.allUserGroupConvo = [
        ...state.allUserGroupConvo.map((userConversation) =>
          userConversation._id === action.payload.convo._id
            ? action.payload.convo
            : userConversation
        ),
      ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },

    addANewConvo: (state, action) => {
      state.allInboxConversation = [
        action.payload,
        ...state.allInboxConversation,
      ];
    },

    updateAConvo: (state, action) => {
      // this will find the existing conversation and update it with the new one
      state.allInboxConversation = [
        ...state.allInboxConversation.map((userConversation) =>
          userConversation._id === action.payload.convo._id
            ? action.payload.convo
            : userConversation
        ),
      ].sort(
        (a, b) =>
          new Date(b.conversation.updatedAt) -
          new Date(a.conversation.updatedAt)
      );
    },
  },
});

export const {
  setActiveConversation,
  setActiveConvoArrayId,
  setCurrentConvoName,
  setActiveConvo,
  filterRestoredConvo,
  setActiveConvoIsGroup,
  setActiveConvoIsArchived,
  setActiveDirectUser,
  setUserIsFriend,
  initDirectsAndGroups,
  initAllUserConversation,
  initAllUserGroupConvo,
  updateAGroupConvo,
  setActiveConvoMembers,
  addANewConvo,
  updateAConvo,
  filterArchivedConvo,
} = conversationSlice.actions;

export default conversationSlice.reducer;
