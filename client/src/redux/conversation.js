import { createSlice, current } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    currentConvoName: "",
    activeUserConvo: null,
    activeConvo: null,
    activeConvoArrayId: null,
    activeConvoIsGroup: false,
    activeConvoIsArchived: false,
    allDirectConversation: null,
    activeConvoMembers: null,
    filteredConvoMembers: [],
    allGroupConversation: null,
    allArchivedConversation: null,
    activeDirectUser: null,
    userIsFriend: true,
    isMentioning: false,
    toMention: {},
    message: "",
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },

    setToMention: (state, action) => {
      console.log("RESETTING THE MENTIONS!", action.payload);
      state.toMention = action.payload;

      console.log("AFTER RESET:", JSON.parse(JSON.stringify(state.toMention)));
    },

    addToMention: (state, action) => {
      const userId = action.payload;
      const currentMentions = JSON.parse(JSON.stringify(state.toMention));

      if (currentMentions[userId]) {
        currentMentions[userId] += 1;
      } else {
        currentMentions[userId] = 1;
      }

      console.log("CURRENT MENTIONS:", currentMentions);

      state.toMention = currentMentions;
    },

    removeToMention: (state, action) => {
      const userId = action.payload;
      const currentMentions = JSON.parse(JSON.stringify(state.toMention));

      if (currentMentions[userId] - 1 == 0) delete currentMentions[userId];
      else {
        currentMentions[userId] -= 1;
      }

      console.log("CURRENT MENTIONS:", currentMentions);

      state.toMention = currentMentions;
    },
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
      state.allDirectConversation = state.allDirectConversation.filter(
        (userConversation) => {
          // If the convoId matches, exclude it in the direct conversation list
          if (userConversation.conversation._id === action.payload) {
            state.allArchivedConversation.push(userConversation);

            return false;
          }

          // If it doesn't match, keep the conversation in the direct conversation list
          return true;
        }
      );
    },
    filterRestoredConvo: (state, action) => {
      state.allArchivedConversation = state.allArchivedConversation.filter(
        (userConversation) => {
          if (userConversation.conversation._id === action.payload) {
            state.allDirectConversation.push(userConversation);
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
      console.log("GROUP MEMBERS");
      state.activeConvoMembers = action.payload;
    },

    setFilteredConvoMembers: (state, action) => {
      state.filteredConvoMembers = state.activeConvoMembers.filter((member) =>
        member.username.toLowerCase().includes(action.payload)
      );
      if (state.filteredConvoMembers.length == 0) {
        console.log("DIDN'T MATCH ANY");
        state.isMentioning = false;
      }
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

    setIsMentioning: (state, action) => {
      state.isMentioning = action.payload;
    },

    initDirectsAndGroups: (state, action) => {
      state.allDirectConversation = action.payload[0];
      state.allGroupConversation = action.payload[1];
    },

    initAllDirectConversation: (state, action) => {
      state.allDirectConversation = action.payload;
    },
    initAllGroupConversation: (state, action) => {
      state.allGroupConversation = action.payload;
    },
    initAllArchivedConversation: (state, action) => {
      state.allArchivedConversation = action.payload;
    },
    initAllUserConversation: (state, action) => {
      state.allDirectConversation = action.payload[0];
      state.allGroupConversation = action.payload[1];
      state.allArchivedConversation = action.payload[2];
    },

    initAllUserGroupConvo: (state, action) => {
      state.allGroupConversation = action.payload;
    },
    updateAGroupConvo: (state, action) => {
      state.allGroupConversation = [
        ...state.allGroupConversation.map((userConversation) =>
          userConversation._id === action.payload.convo._id
            ? action.payload.convo
            : userConversation
        ),
      ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },

    addANewConvo: (state, action) => {
      state.allDirectConversation = [
        action.payload,
        ...state.allDirectConversation,
      ];
    },

    updateAConvo: (state, action) => {
      // this will find the existing conversation and update it with the new one
      state.allDirectConversation = [
        ...state.allDirectConversation.map((userConversation) =>
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
  setMessage,
  setToMention,
  addToMention,
  removeToMention,
  setIsMentioning,
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
  initAllDirectConversation,
  initAllGroupConversation,
  initAllArchivedConversation,
  initAllUserConversation,
  initAllUserGroupConvo,
  updateAGroupConvo,
  setActiveConvoMembers,
  addANewConvo,
  updateAConvo,
  filterArchivedConvo,
  setFilteredConvoMembers,
} = conversationSlice.actions;

export default conversationSlice.reducer;
