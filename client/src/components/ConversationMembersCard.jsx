import { socket } from "../socket";
import {
  createConversation,
  findConvoWithUser,
  getAllUserMessages,
  leaveConversation,
  removeMemberFromGroup,
} from "../api/conversation";
import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserContext } from "../App";
import {
  setActiveMemberMenuId,
  setMediaFiles,
  setMediaImages,
} from "../redux/media";
import { getUser } from "../api/user";
import {
  hideProfileOverlay,
  setDisplayedUser,
  showProfileOverlay,
} from "../redux/profileOverlay";
import {
  initDisplayedMessages,
  setInitialMessageRender,
  setMessageIsLoading,
} from "../redux/message";
import {
  addANewConvo,
  removeAConvo,
  setActiveConversation,
  setActiveConvoIsGroup,
  setActiveConvoMembers,
  setActiveDirectUser,
  setConversationRole,
  setConversationStatus,
  setCurrentConvoImage,
  setUnifiedEmojiBtn,
  setUserIsFriend,
} from "../redux/conversation";
import {
  changeActiveInbox,
  setConvoViewMode,
  updateSidebar,
} from "../redux/sidebar";
import { isFriend } from "../api/friends";
export default function ConversationMembersCard({ member }) {
  const { user } = useContext(UserContext);
  const { activeMemberMenuId } = useSelector((state) => state.media);
  const [displayMemberCard, setDisplayMemberCard] = useState(true);
  const { activeConvo, activeUserConvo, conversationRole } = useSelector(
    (state) => state.conversation
  );

  const dispatch = useDispatch();
  async function removeMember(conversationId, member) {
    // remove member in real-time
    dispatch(setActiveMemberMenuId(""));
    setDisplayMemberCard(false);

    socket.emit("create message", {
      message: `${member.username} has been removed from the group.`,
      conversationId,
      member,
      action: "remove_member",
    });

    socket.emit("remove member", { conversationId, member });
  }

  async function handleDisplayProfile() {
    const userData = await getUser(member._id);

    dispatch(showProfileOverlay());
    dispatch(setDisplayedUser(userData));
    dispatch(setActiveMemberMenuId(""));
  }

  const handleChat = async () => {
    console.log("chatting...");

    try {
      dispatch(setInitialMessageRender(true));

      // find user conversation

      let userConversation = await findConvoWithUser(member._id);

      // create a new user if there's no existing user conversation data
      if (!userConversation) {
        userConversation = await createConversation(
          [user._id, member._id],
          false,
          "direct"
        );

        console.log("created a new direct conversation:", userConversation);
        dispatch(addANewConvo(userConversation));
      }

      const { conversation, conversationName, status } = userConversation;

      socket.emit("join rooms", userConversation.conversation._id);

      await getMessages(
        conversation._id,
        conversationName,
        userConversation._id
      );

      socket.emit("chat user", {
        user: member._id,
        conversation: userConversation.conversation._id,
      });

      dispatch(setActiveMemberMenuId(""));
      dispatch(setCurrentConvoImage(member.profilePictureUrl));

      dispatch(setUnifiedEmojiBtn(userConversation.conversation.unifiedEmoji));

      dispatch(
        updateSidebar({
          sidebarTitle: status === "archived" ? "archived" : "inbox",
          sidebarContent: status === "archived" ? "archived" : "inbox",
          sidebarBtn: status === "archived" ? "archived-btn" : "inbox-btn",
        })
      );

      dispatch(setConversationRole(userConversation.role));
      dispatch(setActiveDirectUser(member._id));
      dispatch(setActiveConvoIsGroup(false));
      dispatch(changeActiveInbox("direct"));
      dispatch(hideProfileOverlay());

      const friendState = await chatmateIsFriend(member._id);
      dispatch(setUserIsFriend(friendState == "friend"));
      dispatch(setConvoViewMode(0));
    } catch (error) {
      console.error("Failed to handle conversation click:", error);
    }
  };

  async function chatmateIsFriend(chatmateId) {
    try {
      const isAFriend = await isFriend(chatmateId);
      return isAFriend;
    } catch (error) {
      console.error("Error checking friend status:", error);
    }
  }

  const handleLeaveGroup = () => {
    console.log("leaving group...");

    // Delete the user conversation in the redux array
    dispatch(removeAConvo({ isGroup: true, conversationId: activeUserConvo }));
    // set the conversation to loading (for now)
    dispatch(setMessageIsLoading(true));
    // set the conversation as active by default for now
    dispatch(setConversationStatus(""));

    dispatch(setActiveConversation(["", null, null]));
    dispatch(setActiveConvoMembers([]));
    // Delete the user conversation in the db

    socket.emit("leave group", { userConvoId: activeUserConvo, user });
    // leaveConversation(activeUserConvo);
  };

  const getMessages = async (convoId, convoName, userConvoId) => {
    const messages = await getAllUserMessages(convoId);

    let allImages = [];
    let allFiles = [];
    messages.forEach((messageData) => {
      allImages = [...allImages, ...messageData.imageUrls];
      allFiles = [...allFiles, ...messageData.fileUrls];
    });

    dispatch(setMediaImages(allFiles));
    dispatch(setMediaFiles([]));
    dispatch(setActiveConversation([convoName, convoId, userConvoId]));
    dispatch(initDisplayedMessages(messages));
  };

  return (
    <div
      className={`flex justify-between p-1 cursor-pointer items-center gap-5 w-full`}
    >
      <div className="flex items-center gap-5">
        {/* Profile Image */}
        <img
          src={member.profilePictureUrl}
          className="w-13 h-13 rounded-full border-1"
        ></img>

        {/* Text */}
        <p>{member.username}</p>
      </div>
      <div className="relative">
        <button
          className="cursor-pointer rounded-full hover:bg-gray-200 p-2"
          onClick={(e) => {
            dispatch(
              setActiveMemberMenuId(activeMemberMenuId == "" ? member._id : "")
            );
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="gray"
            className="w-7 h-7"
          >
            <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
          </svg>
        </button>
        <div
          className={`${
            activeMemberMenuId === member._id ? "flex" : "hidden"
          } absolute z-1 top-full mt-3 right-0 rounded-sm w-50 bg-gray-50 shadow-lg origin-top duration-100 flex-col justify-start`}
        >
          <a
            className={`${
              member._id == user._id ? "hidden" : "block"
            } hover:bg-blue-200 rounded-sm p-2`}
            onClick={(e) => handleChat()}
          >
            Chat
          </a>
          <a
            className={`${
              member._id == user._id ? "hidden" : "block"
            } hover:bg-blue-200 rounded-sm p-2`}
            onClick={(e) => handleDisplayProfile()}
          >
            View Profile
          </a>

          <a
            className={`${
              member._id == user._id ? "block" : "hidden"
            } hover:bg-blue-200 rounded-sm p-2`}
            onClick={handleLeaveGroup}
          >
            Leave Group
          </a>

          {member._id != user._id &&
            (conversationRole == "admin" || conversationRole == "owner") && (
              <a
                onClick={(e) => removeMember(activeConvo, member)}
                className="hover:bg-blue-200 rounded-sm p-2"
              >
                Remove Member
              </a>
            )}
        </div>
      </div>
    </div>
  );
}
