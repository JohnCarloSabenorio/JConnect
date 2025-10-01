import { useState, useEffect, useContext } from "react";
import { isFriend } from "../api/friends";
import { changeSidebarSearch } from "../redux/sidebar";
import { getAllUserMessages } from "../api/conversation";
import {
  initDisplayedMessages,
  setInitialMessageRender,
} from "../redux/message";
import { useSelector, useDispatch } from "react-redux";
import { setMessageIsLoading } from "../redux/message";
import { setActiveChatmateId } from "../redux/friend";
import {
  setActiveConversation,
  setConversationStatus,
  setActiveConvoIsGroup,
  setActiveDirectUser,
  setActiveConvoMembers,
  setActiveConvoIsArchived,
  setToMention,
  setConversationRole,
  setUnifiedEmojiBtn,
  setCurrentConvoImage,
  setUserIsFriend,
} from "../redux/conversation";
import { setNamesAndNicknames } from "../redux/nicknamesOverlay";
import { setEmojiPickerIsOpen } from "../redux/chat";

import { UserContext } from "../App";
import { setMediaFiles, setMediaImages } from "../redux/media";
export default function ConversationCard({
  userConversation,
  isArchived,
  inputRef,
}) {
  const { user } = useContext(UserContext);
  const { activeConvoMembers, activeConvo, conversationStatus } = useSelector(
    (state) => state.conversation
  );

  const [chatmate, setChatmate] = useState(null);

  useEffect(() => {
    {
      async function chatmateIsFriend(chatmateId) {
        try {
          const isAFriend = await isFriend(chatmateId);
          setIsAFriend(isAFriend);
        } catch (error) {
          console.error("Error checking friend status:", error);
        }
      }

      if (userConversation && !userConversation.conversation.isGroup) {
        let chatmate = userConversation.conversation.users.find(
          (u) => u._id != user._id
        );

        setChatmate(chatmate);
        if (chatmate) {
          chatmateIsFriend(chatmate._id);
        }
      }
    }
  }, [userConversation]);

  const { allFriends } = useSelector((state) => state.friends);

  const [isOnline, setIsOnline] = useState(false);
  const [isAFriend, setIsAFriend] = useState(false);
  const { sidebarSearch } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const isActive = activeConvo === userConversation.conversation._id;

  const formatTime = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${ampm}`;
  };

  async function getMessages(convoId) {
    // Join a channel for users in the same conversation
    dispatch(setMessageIsLoading(true));
    const messages = await getAllUserMessages(convoId);
    console.log("all the user messages:", messages);

    let allImages = [];
    let allFiles = [];
    messages.forEach((messageData) => {
      allImages = [...allImages, ...messageData.imageUrls];
      allFiles = [...allFiles, ...messageData.fileUrls];
    });

    console.log("all the freaking files:", allFiles);
    dispatch(setMediaImages(allImages));
    dispatch(setMediaFiles(allFiles));
    dispatch(initDisplayedMessages(messages));
    dispatch(setMessageIsLoading(false));
  }

  function checkStatus(friendId) {
    const matchedFriend = allFriends.find(
      (data) => data.friend._id == friendId
    );

    setIsOnline(matchedFriend?.friend.status == "online");
  }

  useEffect(() => {
    if (chatmate) {
      checkStatus(chatmate._id);
    }
  }, [allFriends, chatmate]);

  const messageParts = userConversation.conversation.latestMessage.split(
    /(@\[[^:\]]+:[^\]]+\])/g
  );

  const displayedLatestMessage = messageParts
    .map((part, id) => {
      if (part.match(/(@\[[^:\]]+:[^\]]+\])/g)) {
        const match = part.match(/@\[(.+?):(.+?)\]/);
        return match[2];
      } else {
        return part;
      }
    })
    .join("");

  // CHATS DISPLAYED IN THE SIDEBAR
  return (
    <>
      <div
        className={`mt-5 flex flex-col gap-2 ${
          // This will control the visibility of the chat based on the user's search query in the sidebar.
          (userConversation.conversation.isGroup
            ? userConversation.conversation.conversationName
            : userConversation.conversationName
          )
            .toLowerCase()
            .includes(sidebarSearch.toLowerCase())
            ? "visible"
            : "hidden"
        }`}
        onClick={() => {
          dispatch(setInitialMessageRender(true));
          inputRef.current.innerHTML = "";
          dispatch(setEmojiPickerIsOpen(false));
          dispatch(setConversationStatus(userConversation.status));

          dispatch(setActiveConvoMembers(userConversation.conversation.users));

          dispatch(setConversationRole(userConversation.role));
          // getConvoNamesData(userConversation.conversation._id);

          dispatch(
            setActiveConversation([
              userConversation.conversation.isGroup
                ? userConversation.conversation.conversationName
                : userConversation.conversationName,
              userConversation.conversation._id,
              userConversation._id,
            ])
          );

          dispatch(
            setCurrentConvoImage(
              userConversation.conversation.isGroup
                ? userConversation.conversation.gcImageUrl
                : chatmate?.profilePictureUrl
            )
          );
          dispatch(
            setUnifiedEmojiBtn(userConversation.conversation.unifiedEmoji)
          );
          dispatch(setToMention([]));
          getMessages(userConversation.conversation._id);
          dispatch(
            setActiveConvoIsArchived(userConversation.status == "archived")
          );

          // Checks if the conversation is a group chat or not

          dispatch(setActiveConvoIsGroup(userConversation.isGroup));

          if (chatmate._id) {
            // Updates the active chatmate
            dispatch(setActiveDirectUser(chatmate._id));
            // Checks if the chatmate is a user's friend
            dispatch(setUserIsFriend(isAFriend));
          }
        }}
      >
        <div
          className={`${
            isActive ? "bg-green-200" : "bg-white"
          } rounded-md flex p-5 shadow-md cursor-pointer`}
        >
          <div className="relative">
            <img
              src={
                userConversation.conversation.isGroup
                  ? userConversation.conversation.gcImageUrl
                  : chatmate?.profilePictureUrl
              }
              className="rounded-full w-12 h-12 border-1"
            />
            <div
              className={`${
                userConversation.conversation.isGroup || !isAFriend
                  ? "hidden"
                  : "block"
              } absolute right-0.5 border-1 bottom-1 ${
                isOnline ? "bg-green-400" : "bg-gray-400"
              } w-4 h-4 rounded-full`}
            ></div>
          </div>
          <div className="flex flex-grow">
            <div className="px-3  flex-grow">
              <p className="font-bold">
                {userConversation.conversation.isGroup
                  ? userConversation.conversation.conversationName
                  : userConversation.conversationName}
              </p>
              <p>
                {displayedLatestMessage.length > 10
                  ? displayedLatestMessage.slice(0, 19) + "..."
                  : displayedLatestMessage}
              </p>
            </div>
            <div className="ml-auto">
              <p>{formatTime(userConversation.conversation.updatedAt)}</p>
              <p className="text-right font-bold">#</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
