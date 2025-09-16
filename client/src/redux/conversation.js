import { createSlice, current } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    currentConvoImage: "",
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
    conversationRole: "member",
    unifiedEmojiBtn: "1f44d",
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },

    setUnifiedEmojiBtn: (state, action) => {
      state.unifiedEmojiBtn = action.payload;
    },

    setConversationRole: (state, action) => {
      state.conversationRole = action.payload;
    },
    setConversationStatus: (state, action) => {
      state.conversationStatus = action.payload;
    },

    setToMention: (state, action) => {
      state.toMention = action.payload;
    },

    addToMention: (state, action) => {
      const userId = action.payload;
      let currentMentions = JSON.parse(JSON.stringify(state.toMention));

      if (!currentMentions.includes(userId)) {
        currentMentions.push(userId);
      }

      state.toMention = currentMentions;
    },

    removeToMention: (state, action) => {
      const userId = action.payload;
      let currentMentions = JSON.parse(JSON.stringify(state.toMention));

      if (currentMentions.includes(userId)) {
        currentMentions = currentMentions.filter((id) => id != userId);
      }

      state.toMention = currentMentions;
    },
    setActiveConversation: (state, action) => {
      state.currentConvoName = action.payload[0];
      state.activeConvo = action.payload[1];
      state.activeUserConvo = action.payload[2];
    },

    setCurrentConvoImage: (state, action) => {
      state.currentConvoImage = action.payload;
    },
    setCurrentConvoName: (state, action) => {
      state.currentConvoName = action.payload;
    },

    setActiveConvo: (state, action) => {
      state.activeConvo = action.payload;
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
      state.activeConvoMembers = action.payload;
    },

    removeConvoMember: (state, action) => {
      state.activeConvoMembers = state.activeConvoMembers.filter(
        (member) => member._id != action.payload
      );
    },

    setFilteredConvoMembers: (state, action) => {
      state.filteredConvoMembers = state.activeConvoMembers.filter((member) =>
        member.username.toLowerCase().includes(action.payload)
      );
      if (state.filteredConvoMembers.length == 0) {
        state.isMentioning = false;
      }
    },

    setActiveDirectUser: (state, action) => {
      console.log("changing direct user id to:", action.payload);
      state.activeDirectUser = action.payload;
    },

    setUserIsFriend: (state, action) => {
      state.userIsFriend = action.payload;
    },

    setActiveConvoIsGroup: (state, action) => {
      state.activeConvoIsGroup = action.payload;
      state.userIsFriend = action.payload;
      // state.activeDirectUser = action.payload;
    },
    setActiveConvoIsArchived: (state, action) => {
      state.activeConvoIsArchived = action.payload;
    },

    setIsMentioning: (state, action) => {
      state.isMentioning = action.payload;
    },

    initDirectsAndGroups: (state, action) => {
      state.allDirectConversation = action.payload[0].sort(
        (a, b) => new Date(a.updatedAt) + new Date(b.updatedAt)
      );
      state.allGroupConversation = action.payload[1].sort(
        (a, b) => new Date(a.updatedAt) + new Date(b.updatedAt)
      );
    },

    initAllDirectConversation: (state, action) => {
      state.allDirectConversation = action.payload.sort(
        (a, b) => new Date(a.updatedAt) + new Date(b.updatedAt)
      );
    },
    initAllGroupConversation: (state, action) => {
      state.allGroupConversation = action.payload.sort(
        (a, b) => new Date(a.updatedAt) + new Date(b.updatedAt)
      );
    },
    initAllArchivedConversation: (state, action) => {
      state.allArchivedConversation = action.payload.sort(
        (a, b) => new Date(a.updatedAt) + new Date(b.updatedAt)
      );
    },
    initAllUserConversation: (state, action) => {
      state.allDirectConversation = action.payload[0].sort(
        (a, b) => new Date(a.updatedAt) + new Date(b.updatedAt)
      );
      state.allGroupConversation = action.payload[1].sort(
        (a, b) => new Date(a.updatedAt) + new Date(b.updatedAt)
      );
      state.allArchivedConversation = action.payload[2].sort(
        (a, b) => new Date(a.updatedAt) + new Date(b.updatedAt)
      );
    },

    initAllUserGroupConvo: (state, action) => {
      state.allGroupConversation = action.payload;
    },
    updateAGroupConvo: (state, action) => {
      const updatedConversation = action.payload;

      console.log("Updated group conversation:", updatedConversation);

      if (updatedConversation) {
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
      }
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

    updateAConvoNickname: (state, action) => {
      console.log("YEP THIS IS THE ONE:", action.payload);

      state.allDirectConversation = state.allDirectConversation
        .map((userConversation) => {
          if (userConversation._id === action.payload[0]) {
            return {
              ...userConversation,
              nickname: action.payload[1],
            };
          }
          return userConversation;
        })
        .sort(
          (a, b) =>
            new Date(b.conversation.updatedAt) -
            new Date(a.conversation.updatedAt)
        );
    },

    updateAConvo: (state, action) => {
      // this will find the existing conversation and update it with the new one

      const updatedConversation = action.payload;
      console.log("updated direct conversation:", updatedConversation);
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
  setUnifiedEmojiBtn,
  removeConvoMember,
  removeAConvo,
  setMessage,
  setConversationRole,
  setConversationStatus,
  activateGroupConversation,
  setToMention,
  addToMention,
  removeToMention,
  setIsMentioning,
  setActiveConversation,
  setActiveConvoArrayId,
  setCurrentConvoImage,
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
  updateAConvoNickname,
  filterArchivedConvo,
  setFilteredConvoMembers,
  addGroupConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
