import {
  initDisplayedMessages,
  setInitialMessageRender,
} from "../redux/message";

import { useSelector, useDispatch } from "react-redux";
import { setEmojiPickerIsOpen } from "../redux/chat";

import { hideProfileOverlay } from "../redux/profileOverlay";
import {
  setConversationStatus,
  setActiveConvoMembers,
  setConversationRole,
  setActiveConversation,
  setUnifiedEmojiBtn,
  setToMention,
  setActiveConvoIsGroup,
  setActiveConvoIsArchived,
} from "../redux/conversation";

import { updateSidebar, setConvoViewMode } from "../redux/sidebar";

import { setMessageIsLoading } from "../redux/message";
import { getAllUserMessages } from "../api/conversation";

export default function MutualGroupChatCard({ groupData }) {
  const dispatch = useDispatch();
  const { allGroupConversation } = useSelector((state) => state.conversation);
  async function getMessages(convoId) {
    // Join a channel for users in the same conversation
    dispatch(setMessageIsLoading(true));
    const messages = await getAllUserMessages(convoId);
    dispatch(initDisplayedMessages(messages));
    dispatch(setMessageIsLoading(false));
  }

  const openGroupChat = () => {
    dispatch(hideProfileOverlay());
    dispatch(setConvoViewMode(1));
    dispatch(
      updateSidebar({
        sidebarTitle: "inbox",
        sidebarContent: "inbox",
        sidebarBtn: "inbox-btn",
      })
    );
    dispatch(setInitialMessageRender(true));
    dispatch(setEmojiPickerIsOpen(false));
    const selectedUserConversation = allGroupConversation.filter(
      (data) => data.conversation._id == groupData._id
    )[0];

    dispatch(setConversationStatus(selectedUserConversation.status));
    dispatch(
      setActiveConvoMembers(selectedUserConversation.conversation.users)
    );
    dispatch(setConversationRole(selectedUserConversation.role));
    dispatch(
      setActiveConversation([
        selectedUserConversation.conversation.isGroup
          ? selectedUserConversation.conversation.conversationName
          : selectedUserConversation.nickname,
        selectedUserConversation.conversation._id,
        selectedUserConversation._id,
      ])
    );
    dispatch(
      setUnifiedEmojiBtn(selectedUserConversation.conversation.unifiedEmoji)
    );
    dispatch(setToMention([]));
    getMessages(selectedUserConversation.conversation._id);
    dispatch(
      setActiveConvoIsArchived(selectedUserConversation.status == "archived")
    );

    dispatch(setActiveConvoIsGroup(selectedUserConversation.isGroup));

    // dispatch(setActiveConvoMembers());
  };

  return (
    <div
      className="flex gap-3 items-center bg-gray-100 p-3 shadow-md cursor-pointer rounded-md"
      onClick={(e) => openGroupChat()}
    >
      <img
        crossOrigin="anonymous"
        src={groupData.gcImageUrl}
        className="w-12 rounded-full border-1"
        alt="profile-img"
      />
      <p>{groupData.conversationName}</p>
    </div>
  );
}
