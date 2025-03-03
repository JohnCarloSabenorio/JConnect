import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebar";
import isDarkModeReducer from "./isDarkMode";
import conversationReducer from "./conversation";
import friendsReducer from "./friend";
import messageReducer from "./message";
import mediaReducer from "./media";
export default configureStore({
  reducer: {
    sidebar: sidebarReducer,
    isDarkMode: isDarkModeReducer,
    conversation: conversationReducer,
    friends: friendsReducer,
    message: messageReducer,
    media: mediaReducer,
  },
});
