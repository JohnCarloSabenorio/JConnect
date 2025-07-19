import { acceptFriendRequest, rejectFriendRequest } from "../api/friends";
import { useState } from "react";
import { setDisplayedUser } from "../redux/profile_overlay";
import { showProfileOverlay } from "../redux/profile_overlay";
import { getAllUserMessages } from "../api/conversation";
import { initDisplayedMessages } from "../redux/message";

import { useDispatch } from "react-redux";
import {
  setActiveConversation,
  setActiveConvoIsGroup,
  setActiveDirectUser,
  setActiveConvoMembers,
  setActiveConvoIsArchived,
  setToMention,
} from "../redux/conversation";

import { setMessageIsLoading } from "../redux/message";
export default function NotificationCard({ data }) {
  const [requestAccepted, setRequestAccepted] = useState(false);
  const dispatch = useDispatch();
  console.log("notification data:", data);

  async function acceptRequest(actor_id) {
    const response = await acceptFriendRequest(actor_id);

    if (!response) {
      alert("This request is no longer available!");
    }
  }

  async function rejectRequest(actor_id) {
    const response = await rejectFriendRequest(actor_id);

    if (!response) {
      alert("This request is no longer available!");
    }
  }

  async function getMessages(convoId) {
    // Join a channel for users in the same conversation
    dispatch(setMessageIsLoading(true));
    const messages = await getAllUserMessages(convoId);
    dispatch(initDisplayedMessages(messages));
    dispatch(setMessageIsLoading(false));
  }

  return (
    <>
      <div
        className="p-3 text-left gap-5 flex justify-between hover:bg-blue-500 cursor-pointer hover:text-white align-middle"
        onClick={(e) => {
          if (
            data.notification_type == "fr_received" ||
            data.notification_type == "fr_accepted"
          ) {
            dispatch(setDisplayedUser(data.actor));
            dispatch(showProfileOverlay());
          } else if (data.notification_type == "group_invite") {
            // inputRef.current.innerHTML = "";
            const userConversation = data.userconversation;
            console.log("users:", userConversation.conversation.users);
            dispatch(setToMention([]));
            dispatch(
              setActiveConvoMembers(userConversation.conversation.users)
            );
            dispatch(
              setActiveConversation([
                userConversation.conversationName,
                userConversation.conversation._id,
                userConversation._id,
              ])
            );

            getMessages(userConversation.conversation._id);
            dispatch(
              setActiveConvoIsArchived(userConversation.status == "archived")
            );
            dispatch(
              setActiveConvoIsGroup(
                userConversation.conversation.users.length > 2
              )
            );
          } else if (
            data.notification_type == "mention" ||
            data.notification_type == "reaction"
          ) {
            // Handle mention notification
          }
        }}
      >
        <img src="img/avatar.png" className="w-10 h-10"></img>
        <div className="w-full">
          <p>{data.message}</p>
        </div>

        <div className="align-middle flex flex-col justify-center">
          {!data.seen && (
            <div className="rounded-full w-3 h-3 bg-blue-400 mb-4"></div>
          )}
        </div>
      </div>
    </>
  );
}
