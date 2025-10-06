import { useDispatch, useSelector } from "react-redux";
import { showProfileOverlay } from "../redux/profileOverlay";
import { setDisplayedUser } from "../redux/profileOverlay";
import { getAllMessageReactions } from "../api/message";
import Picker, { Emoji } from "emoji-picker-react";
import { socket } from "../socket";
import React from "react";
import { reactToMessage, getTopEmojis } from "../api/message";
import { createPortal } from "react-dom";
import {
  setMessageReactionsId,
  setDisplayReactionsOverlay,
  setAllMessageReactions,
} from "../redux/message";
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../App";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export const Message = React.memo(function Message({
  messageData,
  imagesSent,
  uiChatRef,
}) {
  const { user } = useContext(UserContext);
  const {
    _id: messageId,
    sender,
    mentions,
    createdAt: timeSent,
    reactions,
    message,
    action,
  } = messageData;

  const username = sender.username;

  const isCurrentUser = sender._id === user._id;
  const dispatch = useDispatch();

  const { isDarkMode } = useSelector((state) => state.isDarkMode);
  const { namesAndNicknames } = useSelector((state) => state.nicknamesOverlay);
  const { activeConvo } = useSelector((state) => state.conversation);
  const { displayReactionsOverlay } = useSelector((state) => state.message);
  const [displayReactionPicker, setDisplayReactionPicker] = useState(false);
  const [displayChatReact, setDisplayChatReact] = useState(false);
  const [pickerKey, setPickerKey] = useState(0);
  const buttonRef = useRef(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [timeOpacity, setTimeOpacity] = useState(0);
  const [senderText, setSenderText] = useState("");

  function openPicker() {
    if (!displayReactionPicker && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const pickerHeight = 70; // approximate height of the emoji picker
      const spacing = 8; // space between button and picker

      setPickerPosition({
        top: rect.top - pickerHeight - spacing,
        left: rect.left + rect.width / 2,
      });
    }

    setDisplayReactionPicker(true);
  }

  useEffect(() => {
    function getNickname() {
      if (!namesAndNicknames) return;
      const data = namesAndNicknames.find((data) => data.user._id == user._id);

      if (!data) {
        return;
      }

      setSenderText(data.nickname == "" ? data.user.username : data.nickname);
      // const data = namesAndNicknames.filter(user);
    }

    getNickname();
  }, [namesAndNicknames]);

  useEffect(() => {
    const chat = uiChatRef.current;
    if (!chat) return;

    function handleScroll() {
      if (!buttonRef.current || !chat?.current) {
        return;
      }
      const rect = buttonRef.current.getBoundingClientRect();
      const chatRect = chat.getBoundingClientRect();

      const pickerHeight = 70; // approximate height of the emoji picker
      const spacing = 8; // space between button and picker

      let top = rect.top - pickerHeight - spacing;
      let left = rect.left + rect.width / 2;
      setPickerPosition({
        top: top,
        left: left,
      });

      if (top < chatRect.top || top - pickerHeight > chatRect.height) {
        setDisplayReactionPicker(false);
      }
    }

    chat.addEventListener("scroll", handleScroll);

    return () => {
      chat.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [topReactions, setTopReactions] = useState([]);
  useEffect(() => {
    async function getTop3Emojis(id) {
      let reactionsCount = {};

      reactions.forEach((reaction) => {
        if (reaction.unified in reactionsCount)
          reactionsCount[reaction.unified]++;
        else reactionsCount[reaction.unified] = 1;
      });

      let topReactions = Object.fromEntries(
        Object.entries(reactionsCount)
          .sort(([, count1], [, count2]) => count2 - count1)
          .slice(0, 3)
      );

      setTopReactions(Object.keys(topReactions));
    }

    getTop3Emojis(messageId);
  }, [reactions]);

  function formatTime(timestamp) {
    const newDate = new Date(timestamp);
    const day = newDate.toLocaleDateString("en-US", { weekday: "long" });
    const time = newDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${day}: ${time}`;
  }

  async function handleEmojiClick(emojiData) {
    setDisplayReactionPicker(false);

    // Emit using socket instead

    // const updatedReactions = await reactToMessage(messageId, emojiData.unified);

    if (sender._id != user._id) {
      socket.emit("send notification", {
        message: `${user.username} reacted ${emojiData.emoji} to your message.`,
        receiver: sender._id,
        notification_type: "reaction",
        conversation: activeConvo,
        messageId: messageId,
      });
    }

    socket.emit("message react", {
      userId: user._id,
      messageId,
      receiver: sender._id,
      conversation: activeConvo,
      emojiUnified: emojiData.unified,
      notifMessage: `${user.username} reacted ${emojiData.emoji} to your message.`,
    });
  }

  const messageParts = message.split(/(@\[[^:\]]+:[^\]]+\])/g);

  async function getReactions(id) {
    const reactions = await getAllMessageReactions(id);

    dispatch(setAllMessageReactions(reactions));
  }

  if (action == "message") {
    return (
      <div
        className={"flex flex-col p-7"}
        onMouseEnter={(e) => {
          setDisplayChatReact(true);
        }}
        onMouseLeave={(e) => {
          setDisplayChatReact(false);
        }}
        id={`msg-${messageId}`}
      >
        <div className={isCurrentUser ? "ml-auto flex gap-1" : "flex gap-1"}>
          {isCurrentUser ? (
            <>
              <div className="relative group">
                {message !== "" && (
                  <div className="flex gap-1 items-center">
                    <div className="flex gap-1">
                      <div className="flex justify-center items-center relative">
                        {displayReactionPicker &&
                          createPortal(
                            <div
                              style={{
                                position: "absolute",
                                top: `${pickerPosition.top}px`,
                                left: `${pickerPosition.left}px`,
                                transform: "translateX(-50%)",
                                display: `${
                                  displayReactionPicker ? "block" : "hidden"
                                }`,
                              }}
                              className={`absolute z-[9999]`}
                            >
                              <Picker
                                key={pickerKey}
                                reactionsDefaultOpen={true}
                                onEmojiClick={handleEmojiClick}
                              />
                            </div>,
                            document.body
                          )}

                        <button
                          ref={buttonRef}
                          onClick={(e) => {
                            if (displayReactionPicker) {
                              setDisplayReactionPicker(false);
                            } else {
                              openPicker();
                            }
                            setPickerKey((prev) => prev + 1);
                          }}
                          className={`${
                            displayChatReact || displayReactionPicker
                              ? "block"
                              : "hidden"
                          } cursor-pointer`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className={`bg w-6 h-6 transition-colors ${
                              isDarkMode ? "fill-gray-50" : "fill-gray-800"
                            }`}
                          >
                            <path d="M480-480Zm0 400q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q43 0 83 8.5t77 24.5v90q-35-20-75.5-31.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-32-6.5-62T776-600h86q9 29 13.5 58.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm320-600v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400H276q25 63 80.5 101.5T480-260Z" />
                          </svg>
                        </button>

                        <span
                          className={`z-40 absolute right-0 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-full opacity-${timeOpacity} transition-opacity ${
                            timeOpacity == 0 && "hidden"
                          }`}
                        >
                          {formatTime(timeSent)}
                        </span>
                      </div>
                      <div
                        className="relative max-w-xl bg-blue-400 p-2 rounded-md px-3"
                        id={messageId}
                        onMouseEnter={(e) => {
                          setTimeOpacity(100);
                        }}
                        onMouseLeave={(e) => {
                          setTimeOpacity(0);
                        }}
                      >
                        <p className="break-all">
                          {messageParts.map((part, id) => {
                            if (part.match(/(@\[[^:\]]+:[^\]]+\])/g)) {
                              const match = part.match(/@\[(.+?):(.+?)\]/);

                              return (
                                <span
                                  className="hover:underline cursor-pointer font-bold"
                                  onClick={(e) => {
                                    dispatch(showProfileOverlay());
                                    dispatch(
                                      setDisplayedUser(
                                        mentions.find(
                                          (user) => user._id == match[1]
                                        )
                                      )
                                    );
                                  }}
                                  key={id}
                                >
                                  {match[2]}
                                </span>
                              );
                            } else {
                              return part;
                            }
                          })}
                        </p>

                        {/* Add reaction button */}
                        <div
                          className={`${
                            topReactions.length > 0 ? "block" : "hidden"
                          } absolute mt-3 cursor-pointer flex gap-1 right-0 bg-gray-300 rounded-full py-1 px-2`}
                          onClick={(e) => {
                            getReactions(messageId);

                            dispatch(
                              setDisplayReactionsOverlay(
                                !displayReactionsOverlay
                              )
                            );

                            dispatch(setMessageReactionsId(messageId));
                          }}
                        >
                          {topReactions.map((r, idx) => {
                            return <Emoji key={idx} unified={r} size="22" />;
                          })}

                          <p className="">
                            {reactions.length > 0 && reactions.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="relative group">
                {message !== "" && (
                  <>
                    <p
                      className={`transition-colors ${
                        isDarkMode ? "text-gray-50" : "text-gray-800"
                      } ml-3`}
                    >
                      {senderText}
                    </p>
                    <div className="flex gap-1 items-center">
                      <img
                        src={sender.profilePictureUrl}
                        className="rounded-full w-12 h-12 bg-white"
                        alt="User Image"
                      />
                      <div
                        className="relative max-w-xl bg-green-400 p-2 px-3 rounded-md"
                        id={messageId}
                        onMouseEnter={(e) => {
                          setTimeOpacity(100);
                        }}
                        onMouseLeave={(e) => {
                          setTimeOpacity(0);
                        }}
                      >
                        <p className="break-all">
                          {messageParts.map((part, id) => {
                            if (part.match(/(@\[[^:\]]+:[^\]]+\])/g)) {
                              const match = part.match(/@\[(.+?):(.+?)\]/);
                              return (
                                <span
                                  className="hover:underline cursor-pointer font-bold"
                                  onClick={(e) => {
                                    dispatch(showProfileOverlay());
                                    dispatch(
                                      setDisplayedUser(
                                        mentions.find(
                                          (user) => user._id == match[1]
                                        )
                                      )
                                    );
                                  }}
                                  key={id}
                                >
                                  {match[2]}
                                </span>
                              );
                            } else {
                              return part;
                            }
                          })}
                        </p>

                        {/* Add reaction button */}
                        <div
                          className={`${
                            topReactions.length > 0 ? "block" : "hidden"
                          } absolute left-0 mt-3 cursor-pointer flex gap-1 bg-gray-300 rounded-full py-1 px-2`}
                          onClick={(e) => {
                            getReactions(messageId);

                            dispatch(
                              setDisplayReactionsOverlay(
                                !displayReactionsOverlay
                              )
                            );
                            dispatch(setMessageReactionsId(messageId));
                          }}
                        >
                          {topReactions.map((r, idx) => {
                            return <Emoji key={idx} unified={r} size="22" />;
                          })}

                          <p className="">
                            {reactions.length > 0 && reactions.length}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center items-center gap-1 relative">
                        {displayReactionPicker &&
                          createPortal(
                            <div
                              style={{
                                position: "absolute",
                                top: `${pickerPosition.top}px`,
                                left: `${pickerPosition.left}px`,
                                transform: "translateX(-50%)",
                                display: `${
                                  displayReactionPicker ? "block" : "hidden"
                                }`,
                              }}
                              className={`absolute z-[9999]`}
                            >
                              <Picker
                                key={pickerKey}
                                reactionsDefaultOpen={true}
                                onEmojiClick={handleEmojiClick}
                              />
                            </div>,
                            document.body
                          )}
                        <button
                          ref={buttonRef}
                          onClick={(e) => {
                            if (displayReactionPicker) {
                              setDisplayReactionPicker(false);
                            } else {
                              openPicker();
                            }
                            setPickerKey((prev) => prev + 1);
                          }}
                          className={`${
                            displayChatReact || displayReactionPicker
                              ? "block"
                              : "hidden"
                          } cursor-pointer`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="bg w-6 h-6"
                          >
                            <path d="M480-480Zm0 400q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q43 0 83 8.5t77 24.5v90q-35-20-75.5-31.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-32-6.5-62T776-600h86q9 29 13.5 58.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm320-600v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400H276q25 63 80.5 101.5T480-260Z" />
                          </svg>
                        </button>

                        <span
                          className={`z-40 absolute left-0 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-full  opacity-${timeOpacity} transition-opacity ${
                            timeOpacity == 0 && "hidden"
                          }`}
                        >
                          {formatTime(timeSent)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className={`flex mt-2 ${isCurrentUser ? "ml-auto mr-0" : "ml-0"}`}>
          <div
            className={`w-100 grid ${
              messageData.imageUrls.length === 1
                ? "grid-cols-1"
                : messageData.imageUrls.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            } ${
              isCurrentUser ? "justify-items-end" : "justify-items-start"
            } gap-1`}
          >
            <PhotoProvider>
              {messageData.imageUrls.map((imgUrl, idx) => {
                return (
                  <PhotoView src={`${imgUrl}`} key={idx}>
                    <img
                      src={`${imgUrl}`}
                      className={`bg-transparent rounded-sm cursor-pointer ${
                        messageData.imageUrls.length == 1
                          ? "max-h-80"
                          : messageData.imageUrls.length === 2
                          ? "w-50 h-50"
                          : "w-35 h-35"
                      } `}
                      alt="sent images"
                    />
                  </PhotoView>
                );
              })}
            </PhotoProvider>
          </div>
        </div>
        {messageData.fileUrls.map((file, idx) => {
          return (
            <div
              key={idx}
              className={`flex flex-col mt-2 ${
                isCurrentUser ? "ml-auto mr-0" : "ml-0"
              }`}
            >
              <div className={`max-w-100 flex flex-col gap-2`}>
                <a
                  className="group"
                  href={file.storagename}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="bg-gray-100 p-3 rounded-md items-center cursor-pointer flex flex-wrap justify-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="25"
                      viewBox="0 -960 960 960"
                      width="25"
                      fill="black"
                    >
                      <path d="M320-440h320v-80H320v80Zm0 120h320v-80H320v80Zm0 120h200v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                    </svg>
                    <p className="group-hover:underline">{file.originalname}</p>
                  </div>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div className="flex text-center justify-center items-center text-gray-600 font-medium">
        <p>{message}</p>
      </div>
    );
  }
});

/* 
              <div className="flex flex-col p-5">
                <div className="ml-auto flex gap-2">
                  <div className="max-w-max bg-blue-400 p-2 rounded-sm">
                    <p className="break-all">This is a sample user message!</p>
                  </div>
                  <img
                    src="/img/icons/male-default.jpg"
                    className="rounded-full w-12 h-12"
                  />
                </div>
              </div>
*/

export default Message;
