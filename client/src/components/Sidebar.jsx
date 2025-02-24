import { useState } from "react";
import RecentChat from "./sidebar_contents/RecentChat";
import Friends from "./sidebar_contents/Friends";
import Groups from "./sidebar_contents/Groups";
import ArchivedChat from "./sidebar_contents/ArchivedChat";
import Discover from "./sidebar_contents/Discover";

export default function Sidebar({
  allConvo,
  allFriends,
  convoClickHandler,
  friendClickHandler,
}) {
  const [displayedContent, setDisplayedContent] = useState("Recent");
  const [contentTitle, setContentTitle] = useState("Recent");
  const [currentActiveId, setCurrentActiveId] = useState(null);

  function changeDisplayedContent(content) {
    setDisplayedContent(content);
    setContentTitle(content);
  }

  return (
    <div className="flex bg-white shadow-md mr-0.3">
      <div className="flex flex-col items-center justify-evenly gap-8 p-3 bg-white shadow-md">
        {/* Recent conversation button */}
        <button
          onClick={() => changeDisplayedContent("Recent")}
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="40"
            height="40"
            fill="black"
            viewBox="0 0 50 50"
          >
            <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24.984375 6.9863281 A 1.0001 1.0001 0 0 0 24 8 L 24 22.173828 A 3 3 0 0 0 22 25 A 3 3 0 0 0 22.294922 26.291016 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 23.708984 27.705078 A 3 3 0 0 0 25 28 A 3 3 0 0 0 28 25 A 3 3 0 0 0 26 22.175781 L 26 8 A 1.0001 1.0001 0 0 0 24.984375 6.9863281 z"></path>
          </svg>
        </button>

        {/* Friends button */}
        <button
          onClick={(e) => changeDisplayedContent("Friends")}
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="30"
            height="30"
            fill="black"
          >
            <path d="M96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L96 0zM208 288l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64zM496 192c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64z" />
          </svg>
        </button>

        {/* Groups button */}
        <button
          className="cursor-pointer"
          onClick={() => changeDisplayedContent("Groups")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            width="30"
            height="30"
            fill="black"
          >
            <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
          </svg>
        </button>

        {/* Archived chats button */}
        <button
          className="cursor-pointer"
          onClick={() => changeDisplayedContent("Archived")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            width="30"
            height="30"
            fill="black"
          >
            <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
          </svg>
        </button>

        {/* Discover button */}
        <button
          className="cursor-pointer"
          onClick={() => changeDisplayedContent("Discover")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            width="30"
            height="30"
            fill="black"
          >
            <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col p-5 pt-2">
        <h1 className="text-3xl font-bold">{contentTitle}</h1>
        <input
          type="text"
          className="mt-3 rounded-full p-1 px-2 bg-white shadow-md"
          placeholder="&#xF002; Search..."
          // style={{ fontFamily: "Arial", "FontAwesome" }}
        />
        {displayedContent === "Recent" ? (
          <RecentChat
            allConvo={allConvo}
            currentActiveId={currentActiveId}
            setCurrentActiveId={setCurrentActiveId}
            convoClickHandler={convoClickHandler}
          />
        ) : displayedContent === "Friends" ? (
          <Friends
            allUserFriends={allFriends}
            friendClickHandler={friendClickHandler}
            currentActiveId={currentActiveId}
            setCurrentActiveId={setCurrentActiveId}
            changeSidebarContent={changeDisplayedContent}
          />
        ) : displayedContent === "Groups" ? (
          <Groups />
        ) : displayedContent === "Archived" ? (
          <ArchivedChat />
        ) : displayedContent === "Discover" ? (
          <Discover />
        ) : (
          <p>brother...</p>
        )}
      </div>
    </div>
  );
}
