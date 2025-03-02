import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebar";
import isDarkModeReducer from "./isDarkMode";
export default configureStore({
  reducer: {
    sidebar: sidebarReducer,
    isDarkMode: isDarkModeReducer,
  },
});
