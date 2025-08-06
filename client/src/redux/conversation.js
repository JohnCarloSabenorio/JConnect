import { createSlice, current } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    currentConvoName: "",
    conversationStatus: "",
    activeUserConvo: null,
    activeConvo: null,
    activeConvoArrayId: null,
    activeConvoIsGroup: false,
    activeConvoIsArchived: false,
    allDirectConversation: [],
    activeConvoMembers: [],
    filteredConvoMembers: [],
    allGroupConversation: null,
    allArchivedConversation: [],
    activeDirectUser: null,
    userIsFriend: true,
    isMentioning: false,
    toMention: [],
    message: "",
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },

    setConversationStatus: (state, action) => {
      state.conversationStatus = action.payload;
    },

    setToMention: (state, action) => {
      console.log("RESETTING THE MENTIONS!", action.payload);
      state.toMention = action.payload;
    },

    addToMention: (state, action) => {
      const userId = action.payload;
      let currentMentions = JSON.parse(JSON.stringify(state.toMention));

      if (!currentMentions.includes(userId)) {
        currentMentions.push(userId);
      }
      console.log("CURRENT MENTIONS:", currentMentions);

      state.toMention = currentMentions;
    },

    removeToMention: (state, action) => {
      const userId = action.payload;
      let currentMentions = JSON.parse(JSON.stringify(state.toMention));

      if (currentMentions.includes(userId)) {
        currentMentions = currentMentions.filter((id) => id != userId);
      }

      console.log("CURRENT MENTIONS:", currentMentions);
      state.toMention = currentMentions;
    },
    setActiveConversation: (state, action) => {
      console.log("setting the actives:", action.payload);
      state.currentConvoName = action.payload[0];
      state.activeConvo = action.payload[1];
      state.activeUserConvo = action.payload[2];
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
            userConversation.status = "archived";

            state.allArchivedConversation.push(userConversation);

            return false;
          }

          // If it doesn't match, keep the conversation in the direct conversation list
          return true;
        }
      );
    },

    activateGroupConversation: (state, action) => {
      const userConvo = state.allGroupConversation.find(
        (userConvo) => userConvo._id == action.payload
      );

      userConvo.status = "active";
    },

    filterRestoredConvo: (state, action) => {
      state.allArchivedConversation = state.allArchivedConversation.filter(
        (userConversation) => {
          if (userConversation.conversation._id === action.payload) {
            userConversation.status = "active";
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
      console.log("GROUP MEMBERS:", action.payload);
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
      console.log("ALL GROUP CONVERSATION:", action.payload);
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
      const updatedConversation = action.payload;
      state.allGroupConversation = [
        ...state.allGroupConversation.map((userConversation) => {
          if (userConversation.conversation._id === updatedConversation._id) {
            return {
              ...userConversation,
              conversation: updatedConversation,
            };
          } else {
            return userConversation;
          }
        }),
      ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },

    addGroupConversation: (state, action) => {
      state.allGroupConversation = [
        action.payload,
        ...state.allGroupConversation,
      ];
    },

    addANewConvo: (state, action) => {
      state.allDirectConversation = [
        action.payload,
        ...state.allDirectConversation,
      ];
    },

    updateAConvo: (state, action) => {
      // this will find the existing conversation and update it with the new one
      console.log("updating redux conversation...");

      const updatedConversation = action.payload;
      state.allDirectConversation = [
        ...state.allDirectConversation.map((userConversation) => {
          if (userConversation.conversation._id === updatedConversation._id) {
            return {
              ...userConversation,
              conversation: updatedConversation,
            };
          } else {
            return userConversation;
          }
        }),
      ].sort(
        (a, b) =>
          new Date(b.conversation.updatedAt) -
          new Date(a.conversation.updatedAt)
      );
    },

    removeAConvo: (state, action) => {
      const [isGroup, conversationId] = action.payload;
      if (!isGroup) {
        state.allDirectConversation = [
          ...state.allDirectConversation.filter((convo) => {
            convo._id === conversationId;
          }),
        ];
      } else {
        state.allGroupConversation = [
          ...state.allGroupConversation.filter((convo) => {
            convo._id === conversationId;
          }),
        ];
      }
    },
  },
});

export const {
  removeAConvo,
  setMessage,
  setConversationStatus,
  activateGroupConversation,
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
  addGroupConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
