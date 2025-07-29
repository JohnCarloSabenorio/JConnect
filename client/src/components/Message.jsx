import { useDispatch, useSelector } from "react-redux";
import { showProfileOverlay } from "../redux/profile_overlay";
import { setDisplayedUser } from "../redux/profile_overlay";
import { getAllMessageReactions } from "../api/message";
import Picker, { Emoji } from "emoji-picker-react";
import { socket } from "../socket";
import React from "react";
import { reactToMessage, getTopEmojis } from "../api/message";
import {
  setMessageReactionsId,
  setDisplayReactionsOverlay,
  setAllMessageReactions,
} from "../redux/message";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";

export const Message = React.memo(function Message({
  imgUrl,
  messageData,
  imagesSent,
}) {
  const { user } = useContext(UserContext);
  const {
    _id: messageId,
    sender,
    mentions,
    createdAt: timeSent,
    reactions,
    message,
  } = messageData;

  const username = sender.username;
  console.log("rerendering:", messageId);
  const isCurrentUser = sender._id === user._id;
  const dispatch = useDispatch();
  const { activeConvo } = useSelector((state) => state.conversation);
  const { displayReactionsOverlay } = useSelector((state) => state.message);
  const [displayReactionPicker, setDisplayReactionPicker] = useState(false);
  const [displayChatReact, setDisplayChatReact] = useState(false);
  const [pickerKey, setPickerKey] = useState(0);

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
    console.log("THE EMOJI DATA:", emojiData);
    setDisplayReactionPicker(false);

    // Emit using socket instead

    // const updatedReactions = await reactToMessage(messageId, emojiData.unified);

    if (sender._id != user._id) {
      console.log("reacted to a messagE!");
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
      emojiUnified: emojiData.unified,
    });
  }

  const messageParts = message.split(/(@\[[^:\]]+:[^\]]+\])/g);

  async function getReactions(id) {
    const reactions = await getAllMessageReactions(id);

    dispatch(setAllMessageReactions(reactions));
  }

  return (
    <div
      className="flex flex-col p-7"
      onMouseEnter={(e) => {
        setDisplayChatReact(true);
      }}
      onMouseLeave={(e) => {
        setDisplayChatReact(false);
      }}
      id={`msg-${messageId}`}
    >
      <div className={`flex ${isCurrentUser ? "ml-auto mr-15" : "ml-15"}`}>
        {/* <p className="">{username}</p> */}
      </div>
      <div className={isCurrentUser ? "ml-auto flex gap-2" : "flex gap-2"}>
        {isCurrentUser ? (
          <>
            <div className="relative group">
              {message !== "" && (
                <div className="flex gap-5 items-center">
                  <div
                    className={`${
                      displayReactionPicker ? "block" : "hidden"
                    } relative`}
                  >
                    <div className="absolute right-0 -bottom-6">
                      <Picker
                        key={pickerKey}
                        reactionsDefaultOpen={true}
                        onEmojiClick={(e) => {
                          handleEmojiClick(e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex justify-center items-center">
                      <button
                        onClick={(e) => {
                          setDisplayReactionPicker((prev) => !prev);
                          setPickerKey((prev) => prev + 1);
                        }}
                        className={`${
                          displayChatReact ? "block" : "hidden"
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
                    </div>
                    <div
                      className="relative max-w-max bg-blue-400 p-2 rounded-full px-3"
                      id={messageId}
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
                            setDisplayReactionsOverlay(!displayReactionsOverlay)
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

              <span className="z-40 absolute left-0 bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {formatTime(timeSent)}
              </span>
            </div>
          </>
        ) : (
          <>
            <img
              src={imgUrl}
              className="rounded-full w-12 h-12 bg-white"
              alt="User Image"
            />

            <div className="relative group">
              {message !== "" && (
                <div className="flex gap-2 items-center">
                  <div
                    className="relative max-w-max bg-green-400 p-2 px-3 rounded-full"
                    id={messageId}
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
                          setDisplayReactionsOverlay(!displayReactionsOverlay)
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
                  <div
                    className={`${
                      displayReactionPicker ? "block" : "hidden"
                    } relative`}
                  >
                    <div className="absolute left-0 -bottom-6">
                      <Picker
                        key={pickerKey}
                        reactionsDefaultOpen={true}
                        onEmojiClick={(e) => {
                          handleEmojiClick(e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center items-center">
                    <button
                      onClick={(e) => {
                        setDisplayReactionPicker((prev) => !prev);
                        setPickerKey((prev) => prev + 1);
                      }}
                      className={`${
                        displayChatReact ? "block" : "hidden"
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
                  </div>
                </div>
              )}

              <span className="z-40 absolute left-0 bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {formatTime(timeSent)}
              </span>
            </div>
          </>
        )}
      </div>

      <div className={`flex mt-2 ${isCurrentUser ? "ml-auto mr-0" : "ml-0"}`}>
        <div className=" w-70 gap-0.5 grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))]">
          {imagesSent.map((blobUrl, idx) => {
            return (
              <img
                key={idx}
                src={blobUrl}
                className={`bg-transparent rounded-sm ${
                  imagesSent.length > 1 ? "aspect-square" : ""
                }`}
                alt="sent image"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
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
