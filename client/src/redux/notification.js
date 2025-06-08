import { createSlice } from "@reduxjs/toolkit";

// Create slice that contains name, intialState, reducers
const notifSlice = createSlice({
  name: "notification",
  initialState: {
    allNotifications: [],
  },

  reducers: {
    setAllNotifications: (state, action) => {
      console.log("ALL THE FREAKING NOTIFS:", action.payload);
      state.allNotifications = action.payload;
    },
    addNotification: (state, action) => {
      state.allNotifications = state.allNotifications.push(action.payload);
    },
  },
});

// export all actions
export const { setAllNotifications, addNotification } = notifSlice.actions;

// export message slice reducer
export default notifSlice.reducer;
