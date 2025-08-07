import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import sidebarReducer from "./sidebar";
import isDarkModeReducer from "./isDarkMode";
import conversationReducer from "./conversation";
import friendsReducer from "./friend";
import messageReducer from "./message";
import mediaReducer from "./media";
import overlayReducer from "./overlay";
import userReducer from "./user";
import profileOverlayReducer from "./profile_overlay";
import notificationReducer from "./notification";
import addMemberOverlayReducer from "./addmember_overlay";
import createGroupChatOverlayReducer from "./creategroupchat_overlay";
import chatReducer from "./chat";
import settingsOverlayReducer from "./settings_overlay";
export default configureStore({
  reducer: {
    sidebar: sidebarReducer,
    isDarkMode: isDarkModeReducer,
    conversation: conversationReducer,
    friends: friendsReducer,
    message: messageReducer,
    media: mediaReducer,
    overlay: overlayReducer,
    user: userReducer,
    profileOverlay: profileOverlayReducer,
    notification: notificationReducer,
    addMemberOverlay: addMemberOverlayReducer,
    chat: chatReducer,
    createGroupChatOverlay: createGroupChatOverlayReducer,
    settingsOverlay: settingsOverlayReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
