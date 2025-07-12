import { createSlice } from "@reduxjs/toolkit";

// Create slice that contains name, intialState, reducers
const notifSlice = createSlice({
  name: "notification",
  initialState: {
    allNotifications: [],
    unreadCount: 0,
    notifActive: false,
  },

  reducers: {
    setAllNotifications: (state, action) => {
      // This will initialize the number of unread notifications and the collection of notifications
      state.allNotifications = action.payload;
      let unreadCount = 0;

      console.log("the notifications:", action.payload);
      state.allNotifications.forEach((notif) => {
        if (!notif.seen) unreadCount++;
      });
      state.unreadCount = unreadCount;
    },
    addNotification: (state, action) => {
      console.log("ADDING A NEW NOTIFICATION BRO!");
      const updatedNotifs = [...state.allNotifications];

      updatedNotifs.push(action.payload);
      state.allNotifications = updatedNotifs;
      let unread = state.unreadCount;
      unread++;
      state.unreadCount = unread;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    setNotifActive: (state, action) => {
      state.notifActive = action.payload;
    },
  },
});

// export all actions
export const {
  setAllNotifications,
  addNotification,
  setUnreadCount,
  setNotifActive,
} = notifSlice.actions;

// export message slice reducer
export default notifSlice.reducer;
