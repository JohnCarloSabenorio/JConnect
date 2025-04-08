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
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
