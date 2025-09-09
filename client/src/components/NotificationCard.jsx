import { acceptFriendRequest, rejectFriendRequest } from "../api/friends";
import { useState } from "react";
import { setDisplayedUser } from "../redux/profileOverlay";
import { showProfileOverlay } from "../redux/profileOverlay";
import { getAllUserMessages } from "../api/conversation";
import {
  initDisplayedMessages,
  setInitialMessageRender,
} from "../redux/message";
import { setConvoViewMode } from "../redux/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setConversationStatus } from "../redux/conversation";
import {
  setActiveConversation,
  setActiveConvoIsGroup,
  setConversationRole,
  setActiveDirectUser,
  setActiveConvoMembers,
  setActiveConvoIsArchived,
  setToMention,
} from "../redux/conversation";

import { setTargetScrollMessageId } from "../redux/message";
import { setMessageIsLoading } from "../redux/message";
export default function NotificationCard({ data }) {
  const [requestAccepted, setRequestAccepted] = useState(false);
  const dispatch = useDispatch();

  const { targetScrollMessageId } = useSelector((state) => state.message);
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
          dispatch(setInitialMessageRender(true));
          if (
            data.notification_type == "fr_received" ||
            data.notification_type == "fr_accepted"
          ) {
            dispatch(setDisplayedUser(data.actor));
            dispatch(showProfileOverlay());
          } else if (
            data.notification_type == "group_invite" ||
            data.notification_type == "mention" ||
            data.notification_type == "reaction"
          ) {
            dispatch(setConvoViewMode(1));
            // inputRef.current.innerHTML = "";
            const userConversation = data.userconversation;
            dispatch(setConvoViewMode(userConversation.isGroup ? 1 : 0));

            if (!userConversation.isGroup) {
              dispatch(setActiveDirectUser(data.actor._id));
            }
            console.log("users:", userConversation.conversation.users);
            dispatch(setToMention([]));
            dispatch(
              setActiveConvoMembers(userConversation.conversation.users)
            );
            dispatch(setConversationStatus(userConversation.status));
            dispatch(setConversationRole(userConversation.role));
            dispatch(
              setActiveConversation([
                userConversation.isGroup
                  ? userConversation.conversationName
                  : userConversation.nickname,
                userConversation.conversation._id,
                userConversation._id,
              ])
            );
            console.log("the user convo in notif:", userConversation);

            getMessages(userConversation.conversation._id);
            dispatch(
              setActiveConvoIsArchived(userConversation.status == "archived")
            );
            dispatch(setActiveConvoIsGroup(userConversation.isGroup));

            if (data.messageId) {
              dispatch(setTargetScrollMessageId(data.messageId));
            }
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
