import { createSlice } from "@reduxjs/toolkit";

//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [searchInput, setSearchInput] = useState("");

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    sidebarTitle: "inbox",
    sidebarContent: "directs",
    sidebarBtn: "inbox-btn",
    sidebarSearch: "",
    activeInbox: "direct",
  },

  reducers: {
    changeSidebarTitle: (state, action) => {
      state.sidebarTitle = action.payload;
    },
    changeSidebarContent: (state, action) => {
      state.sidebarContent = action.payload;
    },
    changeSidebarBtn: (state, action) => {
      state.sidebarBtn = action.payload;
    },

    changeActiveInbox: (state, action) => {
      state.activeInbox = action.payload;
    },

    changeSidebarSearch: (state, action) => {
      state.sidebarSearch = action.payload;
    },

    updateSidebar: (state, action) => {
      const { sidebarTitle, sidebarContent, sidebarBtn } = action.payload;

      state.sidebarTitle = sidebarTitle;
      state.sidebarContent = sidebarContent;
      state.sidebarBtn = sidebarBtn;
    },
  },
});

export const {
  updateSidebar,
  changeSidebarTitle,
  changeSidebarContent,
  changeActiveInbox,
  changeSidebarBtn,
  changeSidebarSearch,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
