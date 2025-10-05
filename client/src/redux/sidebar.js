import { createSlice } from "@reduxjs/toolkit";

//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [searchInput, setSearchInput] = useState("");

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    sidebarTitle: "inbox",
    sidebarContent: "inbox",
    sidebarBtn: "inbox-btn",
    sidebarSearch: "",
    activeInbox: "inbox",
    convoViewMode: 0, // 0 for directs, 1 for groups
    displaySidebar: true,
    displayOpenSidebarBtn: false,
    displayCloseSidebarBtn: false,
  },

  reducers: {
    changeSidebarTitle: (state, action) => {
      state.sidebarTitle = action.payload;
    },
    setConvoViewMode: (state, action) => {
      state.convoViewMode = action.payload;
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

    setDisplaySidebar: (state, action) => {
      state.displaySidebar = action.payload;
    },
    toggleDisplaySidebar: (state, action) => {
      state.displaySidebar = !state.displaySidebar;
    },

    setDisplayOpenSideBar: (state, action) => {
      state.displayOpenSidebarBtn = action.payload;
    },
    setDisplayCloseSideBar: (state, action) => {
      state.displayCloseSidebarBtn = action.payload;
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
  setDisplayOpenSideBar,
  setDisplayCloseSideBar,
  toggleDisplaySidebar,
  setDisplaySidebar,
  updateSidebar,
  changeSidebarTitle,
  changeSidebarContent,
  changeActiveInbox,
  changeSidebarBtn,
  changeSidebarSearch,
  setConvoViewMode,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
