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
import profileOverlayReducer from "./profileOverlay";
import notificationReducer from "./notification";
import addMemberOverlayReducer from "./addMemberOverlay";
import createGroupChatOverlayReducer from "./createGroupChatOverlay";
import chatReducer from "./chat";
import changeChatNameOverlayReducer from "./changeChatNameOverlay";
import settingsOverlayReducer from "./settingsOverlay";
import changeEmojiOverlayReducer from "./changeEmojiOverlay";
import nicknamesOverlayReducer from "./nicknamesOverlay";
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
    changeChatNameOverlay: changeChatNameOverlayReducer,
    changeEmojiOverlay: changeEmojiOverlayReducer,
    nicknamesOverlay: nicknamesOverlayReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
