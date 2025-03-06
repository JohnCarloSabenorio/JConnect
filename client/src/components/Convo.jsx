import { useState, useEffect } from "react";

import { changeSidebarSearch } from "../redux/sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveConvoIsGroup,
  setActiveDirectUser,
  setUserIsFriend,
  setActiveConvoMembers,
} from "../redux/conversation";

import { useContext } from "react";
import { UserContext } from "../App";
export default function Convo({
  name,
  msg,
  msgCount,
  timeSent,
  imageUrl,
  convoId,
  isActive,
  eventHandler,
  isGroup,
  changeCurrentActive,
  friendId,
  convoData,
}) {
  const { loggedInStatus, user, isConnected } = useContext(UserContext);
  const { activeConvoMembers } = useSelector((state) => state.conversation);
  const { sidebarSearch } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const [bgColor, setBgColor] = useState("bg-white");

  useEffect(() => {
    setBgColor(isActive ? "bg-green-200" : "bg-white");
  }, [isActive]);

  useEffect(() => {
    console.log("MEMBES FOR THE GROUP:", activeConvoMembers);
  }, [activeConvoMembers]);

  const formatTime = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <>
      <div
        className={`mt-5 flex flex-col gap-2 ${
          name.toLowerCase().includes(sidebarSearch.toLowerCase())
            ? "visible"
            : "hidden"
        }`}
        onClick={() => {
          eventHandler(convoId, name);
          changeCurrentActive(convoId);
          dispatch(setActiveConvoIsGroup(isGroup));
          if (isGroup) {
            dispatch(setActiveConvoMembers(convoData.users));
          }
          if (friendId) {
            dispatch(setActiveDirectUser(friendId));
            dispatch(setUserIsFriend(true));
          }

          setBgColor("bg-green-200");
        }}
      >
        <div
          className={`${bgColor} rounded-md flex p-5 shadow-md cursor-pointer`}
        >
          <img src={imageUrl} className="rounded-full w-12 h-12" />
          <div className="flex flex-grow">
            <div className="px-3  flex-grow">
              <p className="font-bold">{name}</p>
              <p>{msg.length > 10 ? msg.slice(0, 19) + "..." : msg}</p>
            </div>
            <div className="ml-auto">
              <p>{formatTime(timeSent)}</p>
              <p className="text-right font-bold">{msgCount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
