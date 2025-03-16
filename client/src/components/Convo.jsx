import { useState, useEffect } from "react";
import { isFriend } from "../api/friends";
import { changeSidebarSearch } from "../redux/sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveConvoIsGroup,
  setActiveDirectUser,
  setUserIsFriend,
  setActiveConvoMembers,
  setActiveConvoIsArchived,
} from "../redux/conversation";

import { useContext } from "react";
import { UserContext } from "../App";

/* 
THINGS TO REFACTOR
USE REDUX TO MANAGE THE FOLLOWING: 


1. isActive & isArchived (Try checking the state of the conversation)
2. Check if the user is a group
3. Changing the current active conversation
4.

*/

export default function Convo({
  getMessages,
  chatmateId,
  convoData,
  isArchived,
}) {
  // const { loggedInStatus, user, isConnected } = useContext(UserContext);

  const { activeConvoMembers, activeConvo } = useSelector(
    (state) => state.conversation
  );
  const { sidebarSearch } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const [bgColor, setBgColor] = useState("bg-white");

  useEffect(() => {
    setBgColor(activeConvo === convoData._id ? "bg-green-200" : "bg-white");
  }, [activeConvo]);

  useEffect(() => {
    // console.log("MEMBES FOR THE GROUP:", activeConvoMembers);
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

  const chatmateIsFriend = (chatmateId) => async (dispatch) => {
    try {
      const isAFriend = await isFriend(chatmateId);

      dispatch({
        type: "conversation/setUserIsFriend",
        payload: isAFriend,
      });
    } catch (error) {
      console.error("Error checking friend status:", error);
    }
  };

  return (
    <>
      <div
        className={`mt-5 flex flex-col gap-2 ${
          convoData.convoName
            .toLowerCase()
            .includes(sidebarSearch.toLowerCase())
            ? "visible"
            : "hidden"
        }`}
        onClick={() => {
          getMessages(
            convoData._id,
            convoData.convoName,
            convoData.userConvoId
          );

          dispatch(setActiveConvoIsArchived(isArchived ?? false));

          // console.log("CONVERSATION DATA:", convoData);
          // Updates the active conversation

          // Checks if the conversation is a group chat or not
          dispatch(setActiveConvoIsGroup(convoData.users.length > 2));

          // Updates the member list of the conversation to be displayed in the media panel
          dispatch(setActiveConvoMembers(convoData?.users ?? []));

          if (chatmateId) {
            // Updates the active chatmate
            dispatch(setActiveDirectUser(chatmateId));
            // Checks if the chatmate is a user's friend
            dispatch(chatmateIsFriend(chatmateId));
          }
          setBgColor("bg-green-200");
        }}
      >
        <div
          className={`${bgColor} rounded-md flex p-5 shadow-md cursor-pointer`}
        >
          <img
            src="/img/icons/male-default.jpg"
            className="rounded-full w-12 h-12"
          />
          <div className="flex flex-grow">
            <div className="px-3  flex-grow">
              <p className="font-bold">{convoData.convoName}</p>
              <p>
                {convoData.latestMessage.length > 10
                  ? convoData.latestMessage.slice(0, 19) + "..."
                  : convoData.latestMessage}
              </p>
            </div>
            <div className="ml-auto">
              <p>{formatTime(convoData.updatedAt)}</p>
              <p className="text-right font-bold">#</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
