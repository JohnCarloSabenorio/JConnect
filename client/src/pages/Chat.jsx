import { useContext, useEffect, useState, useRef } from "react";
import Message from "../components/Message";
import { UserContext } from "../App";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../socket";
import EmojiPicker from "emoji-picker-react";
import { Emoji } from "emoji-picker-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MediaPanel from "../components/MediaPanel";
import ProfileOverlay from "../components/ProfileOverlay";
import { createConversation, findConvoWithUser } from "../api/conversation";
import Overlay from "../components/Overlay";
import { getAllUserMessages } from "../api/conversation";
import { toggleMediaPanel } from "../redux/media";

import {
  setActiveConversation,
  updateAGroupConvo,
  addANewConvo,
  updateAConvo,
} from "../redux/conversation";

import {
  initDisplayedMessages,
  updateDisplayedMessages,
} from "../redux/message";

import { setAllFriends, setAllNonFriends } from "../redux/friend";

import { setMediaImages } from "../redux/media";

export default function Chat() {
  const dispatch = useDispatch();
  // REDUX STATES
  const { currentConvoName, activeConvo } = useSelector(
    (state) => state.conversation
  );

  // This will get the messages to be displayed from the message slice
  const { displayedMessages } = useSelector((state) => state.message);

  // This will get all the images to be displayed from the media slice
  const { mediaImages } = useSelector((state) => state.media);

  // USE STATES
  const { user } = useContext(UserContext);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Unique key for input reset
  const [displayEmoji, setDisplayEmoji] = useState(false);

  // This will store the images to be sent by the user
  const [images, setImages] = useState([]);

  // This will store the message to be sent by the user
  const [message, setMessage] = useState("");

  const uiChatRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Get the freinds of the current user

    // getNonFriends();
    socket.on("chat message", (data) => {
      // Messages will be updated if the sent messages is for the current conversation

      console.log("MESSAGE DATA RECEIVED MOTHER DUCKER:", data);
      dispatch(updateDisplayedMessages(data.msg));

      setImages([]);
      setFileInputKey(Date.now());
      // This should scroll down the chat ui if the user is the sender (NEEDS TO BE FIXED)

      // UPDATES THE CONVERSATION LIST

      dispatch(updateAConvo(data));

      // UPDATES THE GROUP CONVERATION LIST
      dispatch(updateAGroupConvo(data));
    });

    return () => {
      socket.off("chat message"); // Clean up on unmount
    };
  }, []);

  useEffect(() => {
    const mediaBlobUrls = [];

    if (displayedMessages?.length > 0) {
      displayedMessages.forEach((message, idx) => {
        if (message.images64) {
          message.images64.forEach((base64, idx) => {
            const blob = base64ToBlob(base64);

            if (blob) {
              mediaBlobUrls.push(URL.createObjectURL(blob));
            }
          });
        }
      });
      dispatch(setMediaImages(mediaBlobUrls));
    }

    uiChatRef.current?.scrollTo({
      top: uiChatRef.current.scrollHeight, // Scrolls to the very bottom
    });

    setImages([]);
  }, [displayedMessages]);

  useEffect(() => {
    // console.log("MEDIA IMAGES:", mediaImages);
  }, [mediaImages]);
  useEffect(() => {
    // console.log("IMAGES TO BE SENT:", images);
  }, [images]);

  // Adds a loading screen if all conversations are not yet retrieved.
  // if (!allInboxConversation) {
  //   return <div>Loading...</div>;
  // }

  function sendMessage(e) {
    e.preventDefault();

    // console.log("SENDING MESSAGE!");
    // IN THE IOCONTROLLER, CHECK IF THE CONVERSATION IS ARCHIVED, IF SO, MOVE IT TO ACTIVE AGAIN

    if (message == "" && images.length == 0) return;
    // console.log("Socket connected?", socket.connected);

    console.log("Active conversation to send message to:", activeConvo);
    socket.emit("chat message", {
      message: message,
      sender: user._id,
      conversation: activeConvo,
      images: images,
    });
    setMessage("");
  }

  // Hides/Displays the emoji picker
  function toggleEmojiPicker() {
    setDisplayEmoji((prev) => !prev);
  }

  // Adds the emoji to the message input
  function addEmojiToInput(emoji) {
    setDisplayEmoji(true);
    // console.log("THE EMOJI: ", emoji);
    setMessage((prev) => prev + emoji.emoji);
  }

  // This will activate the event of the file picker
  function handleFileInputClick() {
    fileInputRef.current.click();
  }

  async function chatAFriend(friendId) {
    // console.log("THE FRIEND ID:", friendId);
    const response = await findConvoWithUser(friendId);

    // console.log("CHAT A FRIEND RESPONSE:", response);
    // This will get the messages using the id of the response, since if the conversation exists, it's in the allInboxConversation array
    // Create a conversation with the friend if no convo exists
    if (response.length == 0) {
      const newConvo = await createConversation(user._id, friendId);
      getMessages(newConvo._id, newConvo.convoName);
      dispatch(addANewConvo(newConvo));
      return newConvo._id;
    }

    getMessages(
      response[0]._id,
      response[0].convoName,
      response[0].userConvoId
    );

    return response[0]._id;
  }

  async function getMessages(convoId, convoName) {
    // Join a channel for users in the same conversation
    const messages = await getAllUserMessages(convoId);
    dispatch(setActiveConversation([convoName, convoId]));
    dispatch(initDisplayedMessages(messages));
  }

  async function handleImagesChange(e) {
    // Get the array of files selected by the user
    const selectedFiles = Array.from(e.target.files);

    // Resets the value of the input files (This way, you can add the image you previously selected);
    e.target.value = "";

    // const blobUrls = selectedFiles.map((file) => URL.createObjectURL(file));

    const selectedFilesBuffer = await Promise.all(
      selectedFiles.map((image) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(image);
          reader.onload = () => resolve(reader.result);
        });
      })
    );
    // console.log("BUFFER FILES: ", selectedFilesBuffer);
    setImages((prev) => [...prev, ...selectedFilesBuffer]);
  }

  function base64ToBlob(base64String) {
    try {
      if (!base64String) {
        throw new Error("Empty base64 string");
      }

      // Extract MIME type and Base64 content
      const matches = base64String.match(/^data:(.*?);base64,(.*)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid Base64 format");
      }

      const mimeType = matches[1];
      const base64Data = matches[2];

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        // Converts each character into a byte
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteNumbers], { type: mimeType });

      // console.log("Generated Blob:", blob);
      return blob;
    } catch (error) {
      console.error("Error converting Base64 to Blob:", error);
      return null;
    }
  }

  function bufferToImage(buffer) {
    const blob = new Blob([buffer], { type: "image/png" });
    return URL.createObjectURL(blob);
  }

  function removeImage(idx) {
    // console.log("image removed!");
    setImages((prev) => prev.filter((_, index) => index !== idx));
  }

  return (
    <>
      {/* <UnfriendOverlay /> */}
      <div className="flex flex-col h-screen overflow-hidden">
        <ProfileOverlay />
        <Navbar />
        {/* Main Content */}
        <div className="flex flex-grow min-h-0 relative">
          <Overlay />

          {/* Sidebar */}

          <Sidebar getMessages={getMessages} chatAFriend={chatAFriend} />

          {/* Chat Interface */}
          <div className="flex flex-grow flex-col w-4xl  bg-gray-50">
            <div className="border-b-8-gray-800 flex p-3 gap-5 px-10 bg-white">
              <img
                src="/img/icons/male-default.jpg"
                className="rounded-full w-12 h-12"
              />
              <div>
                <p className="font-bold text-md">{currentConvoName}</p>
                <p className="text-gray-600">Last active 1 hour ago</p>
              </div>
              <div className="flex gap-5 ml-auto items-center justify-center">
                {/* Voice Call Button */}
                <button className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    width="25"
                    height="25"
                    fill="black"
                  >
                    <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
                  </svg>
                </button>

                {/* Video Call Button */}
                <button className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    width="25"
                    height="25"
                    fill="black"
                  >
                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z" />
                  </svg>
                </button>

                {/* Media Panel Button */}
                <button
                  className="cursor-pointer"
                  onClick={(e) => dispatch(toggleMediaPanel())}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    width="25"
                    height="25"
                    fill="black"
                  >
                    <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* CHAT MESSAGES */}

            <div
              ref={uiChatRef}
              id="chat-ui"
              className="bg-gray-50 flex-grow overflow-y-scroll overflow-x-hidden"
            >
              {displayedMessages?.map((message, i) => {
                let blobUrls = [];
                if (message.images64) {
                  message.images64.forEach((base64, idx) => {
                    const blob = base64ToBlob(base64);

                    if (blob) {
                      blobUrls.push(URL.createObjectURL(blob));
                    }
                  });
                }

                return (
                  <Message
                    key={i}
                    imgUrl="img/icons/male-default.jpg"
                    message={message.message}
                    username={message.sender.username}
                    isCurrentUser={message.sender._id === user._id}
                    timeSent={message.createdAt}
                    imagesSent={blobUrls}
                  />
                );
              })}
            </div>

            <div>
              <div
                className={`p-2 flex gap-3 overflow-x-scroll ${
                  images.length === 0 ? "hidden" : "visible"
                }`}
              >
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-md bg-gray-100 flex-shrink-0"
                  >
                    <button
                      onClick={() => {
                        removeImage(idx);
                      }}
                      id={idx}
                      className="absolute backdrop-blur-2xl bg-white -right-1 -top-1 rounded-full border-white w-4 h-4 flex items-center justify-center cursor-pointer text-xs"
                    >
                      x
                    </button>
                    <img
                      src={bufferToImage(img)} // Display selected image
                      className="w-full h-full rounded-md"
                      alt={`Preview ${idx}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <form
                onSubmit={(e) => sendMessage(e)}
                className="flex mt-auto p-3 bg-white border-t-0.5 border-gray-500"
              >
                <>
                  <div>
                    <input
                      key={fileInputKey}
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImagesChange}
                      multiple
                      hidden
                    />
                  </div>
                  {/* File input button */}
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={handleFileInputClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      width="30"
                      height="30"
                      fill="black"
                    >
                      <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
                    </svg>
                  </button>
                  <input
                    className="flex-grow mx-4 p-2 ml-0"
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

                      <div className="flex gap-1">
                        {/* <Emoji unified="1f423" size="25" /> */}
                        <button
                          type="button"
                          onClick={toggleEmojiPicker}
                          className="cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            width="30"
                            height="30"
                            fill="black"
                          >
                            <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260Zm0 180q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
                          </svg>
                        </button>
                        <button className="cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            width="30"
                            height="30"
                            fill="black"
                          >
                            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              </form>
            </div>
          </div>

          <MediaPanel />
        </div>
      </div>
    </>
  );
}
