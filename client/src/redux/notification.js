import { createSlice } from "@reduxjs/toolkit";

// Create slice that contains name, intialState, reducers
const notifSlice = createSlice({
  name: "notification",
  initialState: {
    allNotifications: [],
    unreadCount: 0,
  },

  reducers: {
    setAllNotifications: (state, action) => {
      // This will initialize the number of unread notifications and the collection of notifications
      state.allNotifications = action.payload;
      let unreadCount = 0;
      state.allNotifications.forEach((notif) => {
        if (!notif.seen) unreadCount++;
      });
      state.unreadCount = unreadCount;
    },
    addNotification: (state, action) => {
      state.allNotifications = state.allNotifications.push(action.payload);
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
});

// export all actions
export const { setAllNotifications, addNotification, setUnreadCount } =
  notifSlice.actions;

// export message slice reducer
export default notifSlice.reducer;
