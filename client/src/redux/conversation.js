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
    allDirectConvo: null,
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
      if (state.activeConvoIsGroup) {
        state.allUserGroupConvo = state.allUserGroupConvo.filter(
          (userConversation) => {
            // If the convoId matches, exclude it in the group conversation list
            if (userConversation.conversation._id === action.payload) {
              state.allUserArchivedConvo.push(userConversation);
              console.log("THE ARCHIVED GROUP CONVO:", userConversation);
              return false;
            }

            // If it doesn't match, keep the conversation in the group conversation list
            return true;
          }
        );
      } else {
        state.allDirectConvo = state.allDirectConvo.filter(
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
      }
    },
    filterRestoredConvo: (state, action) => {
      if (state.activeConvoIsGroup) {
        state.allUserArchivedConvo = state.allUserArchivedConvo.filter(
          (userConversation) => {
            if (userConversation.conversation._id === action.payload) {
              state.allUserGroupConvo.push(userConversation);
              console.log("THE RESTORED GROUP CONVO:", userConversation);
              // If the convoId matches, add it in the group conversation list
              return false;
            }

            // If it doesn't match, keep the conversation in the archived conversation list
            return true;
          }
        );
      } else {
        state.allUserArchivedConvo = state.allUserArchivedConvo.filter(
          (userConversation) => {
            if (userConversation.conversation._id === action.payload) {
              state.allDirectConvo.push(userConversation);
              // If the convoId matches, add it in the direct conversation list
              return false;
            }
            // If it doesn't match, keep the conversation in the archived conversation list
            return true;
          }
        );
      }
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
      state.allDirectConvo = action.payload[0];
      state.allUserGroupConvo = action.payload[1];
    },
    initAllUserConversation: (state, action) => {
      state.allDirectConvo = action.payload[0];
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
      state.allDirectConvo = [action.payload, ...state.allDirectConvo];
    },

    updateAConvo: (state, action) => {
      // this will find the existing conversation and update it with the new one
      state.allDirectConvo = [
        ...state.allDirectConvo.map((userConversation) =>
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
