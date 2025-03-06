import { useState, useEffect } from "react";
import Inbox from "./sidebar_contents/Inbox";
import Friends from "./sidebar_contents/Friends";
import Groups from "./sidebar_contents/Groups";
import ArchivedChat from "./sidebar_contents/ArchivedChat";
import Discover from "./sidebar_contents/Discover";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSidebar,
  changeSidebarTitle,
  changeSidebarContent,
  changeSidebarBtn,
  changeActiveInbox,
  changeSidebarSearch,
} from "../redux/sidebar";

import { toggleDarkMode } from "../redux/isDarkMode";

export default function Sidebar({
  convoClickHandler,
  friendClickHandler,
  groupClickHandler,
}) {
  const dispatch = useDispatch();

  // STATES
  const {
    sidebarTitle,
    sidebarContent,
    sidebarBtn,
    activeInbox,
    sidebarSearch,
  } = useSelector((state) => state.sidebar);

  const { isDarkMode } = useSelector((state) => state.isDarkMode);
  const { allUserConvo } = useSelector((state) => state.conversation);

  // const [isDarkMode, setIsDarkMode] = useState(false);

  const [currentActiveId, setCurrentActiveId] = useState(
    allUserConvo.length > 0 ? allUserConvo[0]._id : null
  );

  const sideOptionStyle = " p-3 rounded-full cursor-pointer ";
  const activeColor = "bg-blue-800";

  useEffect(() => {
    console.log("the current search input: ", sidebarSearch);
  }, [sidebarSearch]);

  return (
    <div className="flex bg-white shadow-md mr-0.3">
      <div className="flex flex-col pt-4 gap-5 px-3 bg-white shadow-md">
        {/* Inbox conversation button */}
        <button
          onClick={() => {
            dispatch(
              updateSidebar({
                sidebarTitle: "inbox",
                sidebarContent: "directs",
                sidebarBtn: "inbox-btn",
              })
            );
          }}
          className={
            // Remember the space at the end of the first string.. so that the classes don't combine
            sideOptionStyle +
            (sidebarBtn === "inbox-btn" ? activeColor : "bg-white")
          }
          id="inbox-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="25"
            height="25"
            fill={sidebarBtn === "inbox-btn" ? "white" : "#53575e"}
          >
            <path d="M121 32C91.6 32 66 52 58.9 80.5L1.9 308.4C.6 313.5 0 318.7 0 323.9L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-92.1c0-5.2-.6-10.4-1.9-15.5l-57-227.9C446 52 420.4 32 391 32L121 32zm0 64l270 0 48 192-51.2 0c-12.1 0-23.2 6.8-28.6 17.7l-14.3 28.6c-5.4 10.8-16.5 17.7-28.6 17.7l-120.4 0c-12.1 0-23.2-6.8-28.6-17.7l-14.3-28.6c-5.4-10.8-16.5-17.7-28.6-17.7L73 288 121 96z" />
          </svg>
        </button>

        {/* Friends button */}
        <button
          onClick={(e) => {
            dispatch(
              updateSidebar({
                sidebarTitle: "friends",
                sidebarContent: "Friends",
                sidebarBtn: "friends-btn",
              })
            );
          }}
          className={
            // Remember the space at the end of the first string.. so that the classes don't combine
            sideOptionStyle +
            (sidebarBtn === "friends-btn" ? activeColor : "bg-white")
          }
          id="friends-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            width="25"
            height="25"
            fill={sidebarBtn === "friends-btn" ? "white" : "#53575e"}
          >
            <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
          </svg>
        </button>

        {/* Archived chats button */}
        <button
          onClick={(e) => {
            dispatch(
              updateSidebar({
                sidebarTitle: "archived",
                sidebarContent: "Archived",
                sidebarBtn: "archived-btn",
              })
            );
          }}
          className={
            // Remember the space at the end of the first string.. so that the classes don't combine
            sideOptionStyle +
            (sidebarBtn === "archived-btn" ? activeColor : "bg-white")
          }
          id="archived-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="25"
            height="25"
            fill={sidebarBtn === "archived-btn" ? "white" : "#53575e"}
          >
            <path d="M32 32l448 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96L0 64C0 46.3 14.3 32 32 32zm0 128l448 0 0 256c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64l0-256zm128 80c0 8.8 7.2 16 16 16l160 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-160 0c-8.8 0-16 7.2-16 16z" />
          </svg>
        </button>

        {/* Discover button */}
        <button
          onClick={(e) => {
            dispatch(
              updateSidebar({
                sidebarTitle: "discover",
                sidebarContent: "Discover",
                sidebarBtn: "discover-btn",
              })
            );
          }}
          className={
            // Remember the space at the end of the first string.. so that the classes don't combine
            sideOptionStyle +
            (sidebarBtn === "discover-btn" ? activeColor : "bg-white")
          }
          id="discover-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="25"
            height="25"
            fill={sidebarBtn === "discover-btn" ? "white" : "#53575e"}
          >
            <path d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z" />
          </svg>
        </button>

        <button
          className="p-3 mb-3 cursor-pointer self-end mt-auto"
          onClick={() => {
            dispatch(toggleDarkMode());
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="25"
            height="25"
            fill="#53575e"
            className={`absolute transition-opacity duration-300 ${
              isDarkMode ? "opacity-100" : "opacity-0"
            }`}
          >
            <path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z" />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="25"
            height="25"
            fill="#53575e"
            className={`transition-opacity duration-300 ${
              isDarkMode ? "opacity-0" : "opacity-100"
            }`}
          >
            <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col p-5 pt-2 min-w-50 w-100">
        <h1 className="text-4xl font-bold mt-3">
          {sidebarTitle[0].toUpperCase() + sidebarTitle.slice(1)}
        </h1>

        <div
          className={`flex ${
            sidebarContent === "directs" || sidebarContent === "groups"
              ? "block"
              : "hidden"
          }`}
        >
          <div
            onClick={() => {
              dispatch(changeSidebarContent("directs"));
              dispatch(changeActiveInbox("direct"));
            }}
            className={`cursor-pointer flex-grow text-center p-2 shadow-md ${
              activeInbox == "direct" ? "bg-gray-200" : "bg-white"
            }`}
          >
            Directs
          </div>
          <div
            onClick={() => {
              dispatch(changeSidebarContent("groups"));
              dispatch(changeActiveInbox("group"));
            }}
            className={`cursor-pointer flex-grow text-center p-2 shadow-md ${
              activeInbox == "group" ? "bg-gray-200" : "bg-white"
            }`}
          >
            Groups
          </div>
        </div>
        <input
          type="text"
          className="mt-3 rounded-full p-2 px-5 bg-white shadow-md"
          placeholder="Search..."
          onInput={(e) => {
            dispatch(changeSidebarSearch(e.target.value));
          }}
          // style={{ fontFamily: "Arial", "FontAwesome" }}
        />
        {sidebarContent === "directs" ? (
          <Inbox
            currentActiveId={currentActiveId}
            setCurrentActiveId={setCurrentActiveId}
            convoClickHandler={convoClickHandler}
          />
        ) : sidebarContent === "Friends" ? (
          <Friends
            friendClickHandler={friendClickHandler}
            currentActiveId={currentActiveId}
            setCurrentActiveId={setCurrentActiveId}
          />
        ) : sidebarContent === "groups" ? (
          <Groups
            groupClickHandler={groupClickHandler}
            currentActiveId={currentActiveId}
            setCurrentActiveId={setCurrentActiveId}
          />
        ) : sidebarContent === "Archived" ? (
          <ArchivedChat />
        ) : sidebarContent === "Discover" ? (
          <Discover />
        ) : (
          <p>brother...</p>
        )}
      </div>
    </div>
  );
}
