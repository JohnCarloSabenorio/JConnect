import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    currentConvoName: "",
    activeConvo: null,
    allUserConvo: null,
    allUserGroupConvo: null,
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
    },

    initDirectsAndGroups: (state, action) => {
      state.allUserConvo = action.payload[0];
      console.log("THE PAKING PAYLOAD:", action.payload);
      state.allUserGroupConvo = action.payload[1];
    },
    initAllUserConvo: (state, action) => {
      state.allUserConvo = action.payload;
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
  initDirectsAndGroups,
  initAllUserConvo,
  initAllUserGroupConvo,
  updateAGroupConvo,
  addANewConvo,
  updateAConvo,
} = conversationSlice.actions;

export default conversationSlice.reducer;
