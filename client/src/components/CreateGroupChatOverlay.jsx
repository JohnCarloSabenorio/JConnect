import { useSelector, useDispatch } from "react-redux";
import { setAllUsers } from "../redux/user";
import { getAllUsers } from "../api/user";
import SelectedUserBadge from "./SelectedUserBadge";
import FilteredUserCard from "./FilteredUserCard";
import { useMemo, useEffect, useState } from "react";
import { socket } from "../socket";
import { useContext } from "react";
import { UserContext } from "../App";
import { setDisplayGroupChatOverlay } from "../redux/createGroupChatOverlay";
import { createConversation } from "../api/conversation";
import { setInitialMessageRender, setMessageIsLoading } from "../redux/message";
import {
  setActiveConvoIsGroup,
  setActiveConvoMembers,
  setConversationStatus,
  setToMention,
  setUnifiedEmojiBtn,
} from "../redux/conversation";
import { setConvoViewMode } from "../redux/sidebar";
import { changeActiveInbox } from "../redux/sidebar";
import { addANewConvo } from "../redux/conversation";
import { getAllUserMessages } from "../api/conversation";
import {
  setActiveConversation,
  setConversationRole,
} from "../redux/conversation";
import { initDisplayedMessages } from "../redux/message";
import { updateSidebar } from "../redux/sidebar";
import { addGroupConversation } from "../redux/conversation";
import { setEmojiPickerIsOpen } from "../redux/chat";
export default function CreateGroupChatOverlay() {
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);
  const { allUsers } = useSelector((state) => state.user);

  const { displayGroupChatOverlay } = useSelector(
    (state) => state.createGroupChatOverlay
  );
  const [searchString, setSearchString] = useState("");
  const [convName, setConversationName] = useState("");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (allUsers.length == 0) return [];

    console.log("the search string:", searchString);
    return allUsers.filter(
      (u) =>
        user._id != u._id &&
        u.username
          .toLowerCase()
          .trim()
          .includes(searchString.toLowerCase().trim())
    );
  }, [allUsers, searchString]);

  const getMessages = async (convoId, convoName, userConvoId) => {
    const messages = await getAllUserMessages(convoId);
    dispatch(setActiveConversation([convoName, convoId, userConvoId]));
    dispatch(initDisplayedMessages(messages));
  };

  async function fetchAllUsers() {
    try {
      const allFetchedUsers = await getAllUsers();
      dispatch(setAllUsers(allFetchedUsers));
    } catch (err) {
      console.log("Error fetching all users:", err);
    }
  }
  const { selectedUsers } = useSelector((state) => state.addMemberOverlay);

  async function createGroupConversation() {
    try {
      dispatch(setInitialMessageRender(true));

      // Create the conversation
      const newConversationData = await createConversation(
        [
          ...selectedUsers.map((u) => {
            return u._id;
          }),
          user._id,
        ],
        true,
        convName
      );
      dispatch(setMessageIsLoading(false));
      dispatch(setInitialMessageRender(true));
      dispatch(setEmojiPickerIsOpen(false));
      dispatch(
        setConversationStatus(
          newConversationData.currentUserNewConversation.status
        )
      );
      dispatch(setActiveConvoMembers(newConversationData.users));
      dispatch(
        setActiveConversation([
          newConversationData.currentUserNewConversation.conversationName,
          newConversationData.currentUserNewConversation.conversation._id,
          newConversationData.currentUserNewConversation._id,
        ])
      );
      dispatch(
        setUnifiedEmojiBtn(
          newConversationData.currentUserNewConversation.conversation
            .unifiedEmoji
        )
      );
      dispatch(setToMention([]));
      dispatch(
        setActiveConvoIsGroup(
          newConversationData.currentUserNewConversation.isGroup
        )
      );
      // Add the new user conversation of the current user to the redux array
      dispatch(addANewConvo(newConversationData.currentUserNewConversation));

      const { conversation, conversationName, status } =
        newConversationData.currentUserNewConversation;

      // Connect the current user
      socket.emit(
        "join rooms",
        newConversationData.currentUserNewConversation.conversation._id
      );

      // Connect all of the new user conversations to socket

      selectedUsers.forEach((u) => {
        socket.emit("send notification", {
          message: `${user.username} invited you to a group chat!`,
          receiver: u._id,
          notification_type: "group_invite",
          conversation:
            newConversationData.currentUserNewConversation.conversation._id,
          actor: "",
        });

        socket.emit("invite groupchat", {
          user: u._id,
          conversation:
            newConversationData.currentUserNewConversation.conversation._id,
        });
      });

      dispatch(
        setConversationRole(newConversationData.currentUserNewConversation.role)
      );
      dispatch(
        addGroupConversation(newConversationData.currentUserNewConversation)
      );

      // Get the messages
      await getMessages(
        conversation._id,
        conversationName,
        newConversationData.currentUserNewConversation._id
      );

      dispatch(
        updateSidebar({
          sidebarTitle: status === "archived" ? "archived" : "inbox",
          sidebarContent: status === "archived" ? "archived" : "inbox",
          sidebarBtn: status === "archived" ? "archived-btn" : "inbox-btn",
        })
      );

      dispatch(setActiveConvoIsGroup(true));
      dispatch(changeActiveInbox("group"));
      dispatch(setConvoViewMode(1));
    } catch (error) {
      console.error("Failed to handle conversation click:", error);
    }
  }

  return (
    <>
      <div
        className={`${
          displayGroupChatOverlay ? "block" : "hidden"
        } absolute w-full h-full z-20 bg-black/70 justify-center items-center flex-col flex
          }`}
      >
        <div className="bg-white p-10 rounded-xl w-170">
          <h3 className="font-bold text-3xl">Create Group Conversation</h3>

          <div className="mt-5">
            <p className="">Conversation Name</p>
            <input
              type="text"
              className="shadow-md p-2 rounded-full w-full"
              name="new-convo-name"
              id="new-convo-name"
              onInput={(e) => {
                setConversationName(e.target.value);
              }}
            />
          </div>
          {/* Search Bar */}

          <h3 className="font-bold text-3xl mt-5">Users</h3>
          <p>
            Type the username or email to search and add users to the group
            conversation.
          </p>
          <input
            type="text"
            className="mt-3 rounded-full p-2 px-5 w-full bg-white shadow-md"
            placeholder="Search..."
            onInput={(e) => {
              setSearchString(e.target.value);
            }}
          />

          {/* USERS SELECTED */}

          {selectedUsers.length == 0 ? (
            <p className="text-center text-gray-700 text-xl mt-10">
              No users selected
            </p>
          ) : (
            <div className="mt-10 flex gap-10 overflow-x-scroll">
              {selectedUsers.map((user, idx) => {
                return <SelectedUserBadge key={idx} user={user} />;
              })}
            </div>
          )}

          {/* Select Users Div */}

          <div className="flex flex-col mt-5 h-60 overflow-y-scroll mb-5">
            {/* Select User Cards  */}
            {filteredUsers.map((user, idx) => {
              return <FilteredUserCard key={idx} user={user} />;
            })}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={(e) => {
                dispatch(setDisplayGroupChatOverlay(false));
              }}
              className="bg-gray-100 hover:bg-blue-400 rounded-full px-4 py-2 text-md shadow-md cursor-pointer font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                createGroupConversation();
                dispatch(setDisplayGroupChatOverlay(false));
                setSearchString("");
                setConversationName("");
              }}
              className="bg-blue-500 hover:bg-blue-400 rounded-full px-4 py-2 text-md text-white shadow-md cursor-pointer font-semibold"
            >
              Create Conversation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
