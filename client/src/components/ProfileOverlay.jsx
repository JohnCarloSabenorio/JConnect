import { useSelector, useDispatch } from "react-redux";
import { hideProfileOverlay } from "../redux/profile_overlay";
import { socket } from "../socket";
import { updateSidebar } from "../redux/sidebar";
import {
  createConversation,
  findConvoWithUser,
  getAllUserMessages,
} from "../api/conversation";
import { useContext } from "react";
import { UserContext } from "../App";
import { initDisplayedMessages } from "../redux/message";
import { convoIsArchived } from "../api/conversation";
import {
  setUserIsFriend,
  addANewConvo,
  setActiveConversation,
  setActiveConvoIsGroup,
  setActiveDirectUser,
} from "../redux/conversation";
import { changeActiveInbox } from "../redux/sidebar";

export default function ProfileOverlay() {
  const { user } = useContext(UserContext);
  const { isDisplayed, displayedUser } = useSelector(
    (state) => state.profileOverlay
  );
  const dispatch = useDispatch();

  async function getMessages(convoId, convoName) {
    // Join a channel for users in the same conversation
    const messages = await getAllUserMessages(convoId);
    dispatch(setActiveConversation([convoName, convoId]));
    dispatch(initDisplayedMessages(messages));
  }

  return (
    <div
      className={`absolute w-full h-full z-20 bg-black/70  justify-center items-center flex-col ${
        isDisplayed ? "flex" : "hidden"
      }`}
    >
      {/* Close Button */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="#e3e3e3"
        className="absolute top-5 right-5 w-10 h-10 cursor-pointer"
        onClick={() => dispatch(hideProfileOverlay())}
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>

      {/* Profile Modal */}
      <div className="bg-white max-w-2xl rounded-md overflow-hidden p-5">
        <div className="bg-white flex gap-5">
          <div>
            <img src="/img/avatar.png" className="" alt="profile-img"></img>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-green-100 p-3 border-green-500 border-1 shadow-md rounded-lg">
            <label className="font-bold" htmlFor="user-name">
              Username
            </label>
            <h1 id="user-name" className="break-words whitespace-normal">
              {displayedUser?.username}
            </h1>
            <label className="font-bold" htmlFor="user-email">
              Email
            </label>
            <p className="break-words whitespace-normal">
              {displayedUser?.email}
            </p>
            <label className="font-bold" htmlFor="user-number">
              Phone Number
            </label>
            <p id="user-number" className="break-words whitespace-normal">
              {displayedUser?.phone_number ?? "-"}
            </p>

            <label className="font-bold" htmlFor="user-location">
              Location
            </label>
            <p id="user-location" className="break-words whitespace-normal">
              {displayedUser?.location ?? "-"}
            </p>
            <label className="font-bold" htmlFor="user-status">
              Status
            </label>
            <p
              id="user-status"
              className="break-words whitespace-normal font-bold text-gray-700"
            >
              {displayedUser?.status}
            </p>
          </div>
        </div>
        <div className="bg-white flex">
          <div className="mt-5 bg-blue-100 p-3 rounded-lg border-1 border-blue-800 shadow-md">
            <h1 className="font-bold">Bio</h1>
            <p className="text-pretty">
              Web developer with a passion for building interactive
              applications. Specializing in JavaScript, React, and Node.js.
              Always looking for ways to improve user experience and write
              clean, scalable code. Currently learning AI and exploring new
              technologies!
            </p>
          </div>
        </div>

        <div className="mt-5 text-align-center">
          <button
            className="bg-blue-300 text-white font-bold rounded-sm px-3 py-2 cursor-pointer"
            onClick={async () => {
              // Check if there is an existing conversation with this user
              let userConversation = await findConvoWithUser(displayedUser._id);

              // Get messages if conversation exists, else create one
              if (userConversation == null) {
                const newConversation = await createConversation(
                  user._id,
                  displayedUser._id
                );

                // Add the new conversation to the sidebar list
                dispatch(addANewConvo(newConversation));
                userConversation = newConversation;
              }

              // Join room in the user conversation
              socket.emit("join rooms", userConversation._id);
              // Get the list of messages of the new conversation
              getMessages(userConversation._id, userConversation.convoName);

              // Check if the conversation is archived
              const isArchived = await convoIsArchived(userConversation._id);

              // Update the sidebar
              dispatch(
                updateSidebar({
                  sidebarTitle: isArchived ? "archived" : "inbox",
                  sidebarContent: isArchived ? "Archived" : "directs",
                  sidebarBtn: isArchived ? "archived-btn" : "inbox-btn",
                })
              );

              dispatch(setActiveConvoIsGroup(false));
              dispatch(changeActiveInbox("direct"));
              dispatch(setActiveDirectUser(displayedUser._id));
              dispatch(hideProfileOverlay());
              dispatch(setUserIsFriend(false));
            }}
          >
            Chat Now!
          </button>
        </div>
      </div>
    </div>
  );
}

// This will get the conversation id from chatAFriend from chat.jsx
// const convoId = await friendClickHandler(friendId);
// const isArchived = await convoIsArchived(convoId);
// console.log("IS THE CONVERSATION ARCHIVED?", isArchived);
// dispatch(setActiveConvoIsGroup(false));
// dispatch(changeActiveInbox("direct"));
// dispatch(setActiveDirectUser(friendId));
// dispatch(setUserIsFriend(true));
// // This may be refactored after other statuses are implemented (blocked, deleted, etc...)

// async function chatAFriend(friendId) {
//   // console.log("THE FRIEND ID:", friendId);
//   const response = await findConvoWithUser(friendId);

//   // console.log("CHAT A FRIEND RESPONSE:", response);
//   // This will get the messages using the id of the response, since if the conversation exists, it's in the allDirectConvo array
//   // Create a conversation with the friend if no convo exists
//   if (response.length == 0) {
//     const newConvo = await createConversation(user._id, friendId);
//     getMessages(newConvo._id, newConvo.convoName, response[0].userConvoId);
//     dispatch(addANewConvo(newConvo));
//     return newConvo._id;
//   }

//   getMessages(
//     response[0]._id,
//     response[0].convoName,
//     response[0].userConvoId
//   );

//   return response[0]._id;
// }
