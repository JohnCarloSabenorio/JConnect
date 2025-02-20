import { useContext, useEffect, useState, useRef } from "react";
import { logout } from "../api/authenticate";
import {
  getAllUserConversation,
  getAllUserMessages,
} from "../api/conversation";
import Convo from "../components/Convo";
import Message from "../components/Message";
import { UserContext } from "../App";
import { socket } from "../socket";
import EmojiPicker from "emoji-picker-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MediaPanel from "../components/MediaPanel";
export default function Chat() {
  const { loggedInStatus, user, isConnected } = useContext(UserContext);
  const [allConvo, setAllConvo] = useState(null);
  const [currentConvo, setCurrentConvo] = useState(null);
  const [convoMessages, setConvoMessages] = useState([]);
  const [displayEmoji, setDisplayEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const uiChatRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Get initial conversation list
    console.log("getting convo:");
    getConversations();
    socket.on("chat message", (data) => {
      // Messages will be updated if the sent messages is for the current conversation

      console.log("THE CONVERSATION UPDATE:", data.convo);
      setConvoMessages((prev) => [...prev, data.msg]);

      // This should scroll down the chat ui if the user is the sender
      if (data.msg.sender._id === user._id) {
        uiChatRef.current?.scrollTo({
          top: uiChatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }

      // UPDATES THE CONVERSATION LIST
      setAllConvo(
        (prev) =>
          [
            ...prev.map((convo) =>
              convo._id === data.convo._id ? data.convo : convo
            ),
          ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sort by latest updatedAt
      );
    });
  }, []);

  useEffect(() => {
    // This will get the initial messages to be displayed (if the currentConvo is null)
    if (allConvo && currentConvo === null) getMessages(allConvo[0]._id);
  }, [allConvo]);

  // Adds a loading screen if all conversations are not yet retrieved.
  if (!allConvo) {
    return <div>Loading...</div>;
  }

  // FUNCTIONS
  // This will get all the conversation for the user
  async function getConversations() {
    const conversations = await getAllUserConversation();

    console.log("FIRST COMBO:", conversations[0]);

    console.log("JOINING ROOMS");
    conversations.forEach((convo) => socket.emit("join rooms", convo._id));
    setAllConvo(conversations);
  }

  // This will set the initial messages displayed to be the most recent conversation
  async function getMessages(convoId) {
    // Join a channel for users in the same conversation
    const messages = await getAllUserMessages(convoId);
    setCurrentConvo(convoId);
    setConvoMessages(messages);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (message) {
      console.log("Socket connected?", socket.connected);
      socket.emit("chat message", {
        message: message,
        sender: user._id,
        conversation: currentConvo,
      });
      setMessage("");
    }
  }

  function toggleEmojiPicker() {
    setDisplayEmoji((prev) => !prev);
  }

  function addEmojiToInput(emoji) {
    setDisplayEmoji(true);
    console.log(emoji);
    setMessage((prev) => prev + emoji.emoji);
  }

  function handleFileInputClick() {
    fileInputRef.current.click();
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-grow">
          {/* Sidebar */}

          <Sidebar allConvo={allConvo} convoClickHandler={getMessages} />

          {/* Chat Interface */}
          <div className="flex flex-col w-4xl bg-gray-50">
            <div className="shadow-md flex p-3 gap-5 px-10 bg-white">
              <img
                src="/img/icons/male-default.jpg"
                className="rounded-full w-12 h-12"
              />
              <div>
                <p className="font-bold text-md">John Doe</p>
                <p className="text-gray-600">Last active 1 hour ago</p>
              </div>
              <div className="flex gap-5 ml-auto items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="30"
                  height="30"
                  fill="black"
                >
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  width="30"
                  height="30"
                  fill="black"
                >
                  <path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="30"
                  height="30"
                  fill="black"
                >
                  <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                </svg>
              </div>
            </div>

            {/* CHAT MESSAGES */}

            <div
              ref={uiChatRef}
              id="chat-ui"
              className="bg-blue-200 w-auto flex-grow min-h-[700px] max-h-[500px] overflow-y-scroll"
            >
              {convoMessages.map((message, i) => {
                return (
                  <Message
                    key={i}
                    imgUrl="img/icons/male-default.jpg"
                    message={message.message}
                    username={message.sender.username}
                    isCurrentUser={message.sender._id === user._id}
                    timeSent={message.createdAt}
                  />
                );
              })}
            </div>

            <form onSubmit={(e) => sendMessage(e)} className="flex mt-auto p-3">
              <div>
                <input type="file" ref={fileInputRef} className="hidden" />

                {/* File input button */}
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={handleFileInputClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    width="30"
                    height="30"
                    fill="black"
                  >
                    <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
                  </svg>
                </button>
              </div>
              <input
                className="flex-grow mx-4 p-2"
                type="text"
                name="message"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />
              <div className="flex items-center justify-center ml-auto gap-5">
                <div className="relative inline-block">
                  <div
                    id="emoji-picker"
                    className={`absolute bottom-full mb-2 left-0 z-10 ${
                      displayEmoji ? "block" : "hidden"
                    }`}
                  >
                    <EmojiPicker onEmojiClick={addEmojiToInput} />
                  </div>

                  <button
                    type="button"
                    onClick={toggleEmojiPicker}
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="30"
                      height="30"
                      fill="black"
                    >
                      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                    </svg>
                  </button>
                </div>
                <button className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="30"
                    height="30"
                    fill="black"
                  >
                    <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <MediaPanel />
        </div>
      </div>
    </>
  );
}
