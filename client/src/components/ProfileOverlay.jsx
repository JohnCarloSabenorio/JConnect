import {
  sendFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  removeFriend,
  acceptFriendRequest,
  isRequestSentToUser,
  isRequestReceived,
  isFriend,
} from "../api/friends";
import { useSelector, useDispatch } from "react-redux";
import { hideProfileOverlay } from "../redux/profile_overlay";
import { socket } from "../socket";
import { useEffect, useState, useContext } from "react";
import {
  setConvoViewMode,
  updateSidebar,
  changeActiveInbox,
} from "../redux/sidebar";
import {
  createConversation,
  findConvoWithUser,
  getAllUserMessages,
} from "../api/conversation";
import { UserContext } from "../App";
import { initDisplayedMessages } from "../redux/message";
import {
  setUserIsFriend,
  addANewConvo,
  setActiveConversation,
  setActiveConvoIsGroup,
  setActiveDirectUser,
} from "../redux/conversation";

import { createNotification, deleteNotification } from "../api/notification";

export default function ProfileOverlay() {
  const { user } = useContext(UserContext);
  const [addBtnText, setAddBtnText] = useState("Add Friend");

  // This will handle the display of the friend dropdown
  const [friendbarActive, setFriendbarActive] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [friendState, setFriendState] = useState();
  const { isDisplayed, displayedUser } = useSelector(
    (state) => state.profileOverlay
  );
  const dispatch = useDispatch();

  useEffect(() => {
    async function checkFriendStatus() {
      // Stop checking the friend status if the overlay is not shown
      if (!displayedUser) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Check if the user already sent a friend request
      const requestSent = await isRequestSentToUser(displayedUser._id);
      if (requestSent) {
        setFriendState("request_sent");
        setAddBtnText("Cancel Request");
        setIsLoading(false);
        return;
      }

      // Check if the user received a friend request
      const requestReceived = await isRequestReceived(displayedUser._id);
      if (requestReceived) {
        setFriendState("request_received");
        setIsLoading(false);
        return;
      }

      // Check if the user is friends with the displayed user
      const friend = await isFriend(displayedUser._id);
      if (friend) {
        setFriendState("friend");
        setIsLoading(false);
        return;
      }

      // By default, set the displayed user to not_friend
      setFriendState("not_friend");
      setAddBtnText("Add Friend");
      setIsLoading(false);
    }

    // If displayed user exists, check the friend status
    if (displayedUser) {
      checkFriendStatus();
    }
  }, [displayedUser]);

  const getMessages = async (convoId, convoName) => {
    const messages = await getAllUserMessages(convoId);
    dispatch(setActiveConversation([convoName, convoId]));
    dispatch(initDisplayedMessages(messages));
  };

  // Add friend function
  const addFriend = async (userId) => {
    sendFriendRequest(userId);
    setIsLoading(true);
    emitNotification({
      message: `user sent you a friend request!`,
      receiver: userId,
      notification_type: "fr_received",
    });
    setFriendState("request_sent");
    setIsLoading(false);
  };

  // Cancel request function

  const removeFriendRequest = async (userId) => {
    cancelFriendRequest(userId);
    setFriendState("not_friend");
  };

  // Accept request function

  const acceptRequest = async (userId) => {
    setIsLoading(true);
    acceptFriendRequest(userId);

    emitNotification({
      message: `${user.username} accepted your friend request.`,
      receiver: userId,
      notification_type: "fr_accepted",
    });

    setFriendState("friend");
    setIsLoading(false);
  };

  // Reject request function
  const rejectRequest = async (userId) => {
    rejectFriendRequest(userId);
    setFriendState("not_friend");
  };

  // Unfriend a user
  const unfriendUser = async (userId) => {
    removeFriend(userId);
    setFriendState("not_friend");
  };

  // Send notification function

  const emitNotification = async (data) => {
    socket.emit("send notification", data);
  };

  const handleChat = async () => {
    try {
      let userConversation = await findConvoWithUser(displayedUser._id);

      if (!userConversation) {
        userConversation = await createConversation(
          user._id,
          displayedUser._id
        );

        console.log("CREATED A CONVERSATION:", userConversation);
        dispatch(addANewConvo(userConversation));
      }

      const { conversation, conversationName, status } = userConversation;

      socket.emit("join rooms", userConversation.conversation._id);
      await getMessages(conversation._id, conversationName);

      dispatch(
        updateSidebar({
          sidebarTitle: status === "archived" ? "archived" : "inbox",
          sidebarContent: status === "archived" ? "archived" : "inbox",
          sidebarBtn: status === "archived" ? "archived-btn" : "inbox-btn",
        })
      );

      dispatch(setActiveDirectUser(displayedUser._id));
      dispatch(setActiveConvoIsGroup(false));
      dispatch(changeActiveInbox("direct"));
      dispatch(hideProfileOverlay());
      dispatch(setConvoViewMode(0));
    } catch (error) {
      console.error("Failed to handle conversation click:", error);
    }
  };

  const renderFriendButtons = () => {
    if (isLoading) {
      return (
        <img src="/img/loading.gif" className="w-10 h-10" alt="Loading..." />
      );
    }

    switch (friendState) {
      case "not_friend":
        return (
          <button
            onClick={() => addFriend(displayedUser._id)}
            className="bg-gray-400 text-white font-bold rounded-sm px-5 py-2 cursor-pointer"
          >
            Add Friend
          </button>
        );
      case "request_sent":
        return (
          <button
            onClick={() => removeFriendRequest(displayedUser._id)}
            className="bg-yellow-500 text-white font-bold rounded-sm px-5 py-2 cursor-pointer"
          >
            Cancel Request
          </button>
        );
      case "request_received":
        return (
          <>
            <button
              onClick={() => acceptRequest(displayedUser._id)}
              className="bg-green-400 text-white font-bold rounded-sm px-5 py-2 cursor-pointer"
            >
              Accept
            </button>
            <button
              onClick={() => rejectRequest(displayedUser._id)}
              className="bg-red-400 text-white font-bold rounded-sm px-5 py-2 cursor-pointer"
            >
              Reject
            </button>
          </>
        );
      case "friend":
        return (
          <button
            className="bg-blue-400 text-white font-bold rounded-sm px-5 py-2 cursor-pointer group relative"
            onClick={() => {
              setFriendbarActive((prev) => !prev);
            }}
          >
            <p>Friend</p>

            <div
              className={`${
                friendbarActive ? "flex" : "hidden"
              } absolute top-full mt-3 right-0 rounded-sm w-50 bg-gray-50 shadow-lg origin-top duration-100 flex-col justify-start`}
            >
              <a
                onClick={(e) => {
                  unfriendUser(displayedUser._id);
                }}
                className="text-gray-800 hover:bg-blue-200 rounded-sm p-2"
              >
                Unfriend
              </a>
            </div>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`absolute w-full h-full z-50 bg-black/70 justify-center items-center flex-col ${
        isDisplayed ? "flex" : "hidden"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="#e3e3e3"
        className="absolute top-5 right-5 w-10 h-10 cursor-pointer"
        onClick={() => {
          dispatch(hideProfileOverlay());
        }}
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>

      <div className="bg-white rounded-md overflow-hidden w-7xl">
        <div className="w-full h-60 bg-red-400"></div>
        <div className="bg-white flex gap-5 p-5">
          <div className="w-40 relative ml-5">
            <div className="bg-pink-400 absolute rounded-full bottom-1">
              <img src="/img/avatar.png" className="w-40" alt="profile-img" />
            </div>
          </div>

          <div className="text-xl">
            <p>{displayedUser?.username ?? "Loading..."}</p>
            <p>69 Friends</p>
          </div>

          <div className="flex gap-2 ml-auto mr-5 items-center">
            {renderFriendButtons()}
            <button
              className="bg-blue-400 text-white font-bold rounded-sm px-5 py-2 cursor-pointer"
              onClick={handleChat}
            >
              Chat Now!
            </button>
          </div>
        </div>

        <div className="mt-5 text-align-center p-5 min-h-50 m-5">
          <h3 className="font-bold">About Me</h3>
          <p className="p-3 min-h-50 text-gray-700 bg-gray-100">bio...</p>
        </div>
      </div>
    </div>
  );
}
