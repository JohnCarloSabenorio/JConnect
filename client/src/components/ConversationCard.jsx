import { useState, useEffect } from "react";
import { isFriend } from "../api/friends";
import { changeSidebarSearch } from "../redux/sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveConvoIsGroup,
  setActiveDirectUser,
  setActiveConvoMembers,
  setActiveConvoIsArchived,
} from "../redux/conversation";

export default function ConversationCard({
  getMessages,
  chatmateId,
  convoData,
  isArchived,
}) {
  const { activeConvoMembers, activeConvo } = useSelector(
    (state) => state.conversation
  );
  const { sidebarSearch } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const [bgColor, setBgColor] = useState("bg-white");

  useEffect(() => {
    setBgColor(activeConvo === convoData._id ? "bg-green-200" : "bg-white");
  }, [activeConvo]);

  useEffect(() => {}, [activeConvoMembers]);

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
    // Check if the person the user is having a conversation with is on his/her friends list
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

  // CHATS DISPLAYED IN THE SIDEBAR
  return (
    <>
      <div
        className={`mt-5 flex flex-col gap-2 ${
          // This will control the visibility of the chat based on the user's search query in the sidebar.
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
          className={`${
            convoData._id == activeConvo ? "bg-green-200" : "bg-white"
          } rounded-md flex p-5 shadow-md cursor-pointer`}
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
