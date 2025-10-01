import {
  useContext,
  useEffect,
  useState,
  useRef,
  useInsertionEffect,
} from "react";
import MentionCard from "../components/MentionCard";
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
import SettingsOverlay from "../components/SettingsOverlay";
import AddMemberOverlay from "../components/AddMemberOverlay";
import { updateANickname } from "../redux/nicknamesOverlay";
import {
  createConversation,
  findConvoWithUser,
  leaveConversation,
} from "../api/conversation";
import Overlay from "../components/Overlay";
import {
  addToMediaFiles,
  addToMediaImages,
  setMediaFiles,
  toggleMediaPanel,
} from "../redux/media";
import { addNotification } from "../redux/notification";
import { setEmojiPickerIsOpen } from "../redux/chat";
import ChangeEmojiOverlay from "../components/ChangeEmojiOverlay";
import EditProfileOverlay from "../components/EditProfileOverlay";
import {
  setIsMentioning,
  activateGroupConversation,
  setToMention,
  setActiveConversation,
  setConversationRole,
  setFilteredConvoMembers,
  updateAGroupConvo,
  addANewConvo,
  updateAConvo,
  updateAConvoNickname,
  removeToMention,
  addGroupConversation,
  setConversationStatus,
  removeAConvo,
  setMessage,
  setUserIsFriend,
  removeConvoMember,
  setActiveConvoMembers,
  setCurrentConvoName,
  setUnifiedEmojiBtn,
  setCurrentConvoImage,
  updateAConvoConvoName,
} from "../redux/conversation";
import {
  activateUserConversation,
  getAllUserMessages,
} from "../api/conversation";
import ReactionsOverlay from "../components/ReactionsOverlay";
import {
  initDisplayedMessages,
  setInitialMessageRender,
  setMessageIsLoading,
  updateDisplayedMessages,
  updateMessage,
} from "../redux/message";
import { createMessage } from "../api/message";
import { setMediaImages } from "../redux/media";
import { setTargetScrollMessageId } from "../redux/message";
import CreateGroupChatOverlay from "../components/CreateGroupChatOverlay";
import ChangeChatNameOverlay from "../components/ChangeChatNameOverlay";
import MessagesContainer from "../components/MessagesContainer";
import NicknamesOverlay from "../components/NicknamesOverlay";
import BlockOverlay from "../components/BlockOverlay";
import { setNamesAndNicknames } from "../redux/nicknamesOverlay";
import { getNamesAndNicknames } from "../api/conversation";
import { updateFriendStatus, setAllFriends } from "../redux/friend";
import { getFriends } from "../api/friends";
export default function Chat() {
  const dispatch = useDispatch();
  // REDUX STATES
  const {
    currentConvoImage,
    currentConvoName,
    activeDirectUser,
    activeConvo,
    activeUserConvo,
    activeConvoMembers,
    filteredConvoMembers,
    activeConvoIsGroup,
    isMentioning,
    userIsFriend,
    message,
    toMention,
    conversationStatus,
    unifiedEmojiBtn,
  } = useSelector((state) => state.conversation);
  const { allFriends } = useSelector((state) => state.friends);

  // This will get the messages to be displayed from the message slice
  const { namesAndNicknames } = useSelector((state) => state.nicknamesOverlay);
  const { displayedMessages, messageIsLoading } = useSelector(
    (state) => state.message
  );

  const [inputMessage, setInputMessage] = useState("");
  const { emojiPickerIsOpen } = useSelector((state) => state.chat);

  const { allNotifications } = useSelector((state) => state.notification);

  // This will get all the images to be displayed from the media slice
  const { mediaImages } = useSelector((state) => state.media);

  // USE STATES
  const { user } = useContext(UserContext);
  const [imageInputKey, setImageInputKey] = useState(Date.now()); // Unique key for input reset
  const [displayEmoji, setDisplayEmoji] = useState(false);

  const { notifActive } = useSelector((state) => state.notification);
  const { targetScrollMessageId, initialRender } = useSelector(
    (state) => state.message
  );

  const [updatedReactions, setUpdatedReactions] = useState([]);
  const [updatedMessageId, setUpdatedMessageId] = useState("");
  // This will store the images to be sent by the user
  const [imageBuffers, setImageBuffers] = useState([]);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

  const uiChatRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    async function getUserFriends() {
      const friends = await getFriends();
      dispatch(setAllFriends(friends));
    }

    getUserFriends();
  }, []);

  useEffect(() => {
    const handleChangeStatus = (data) => {
      dispatch(
        updateFriendStatus([data.updatedUser._id, data.updatedUser.status])
      );
    };

    socket.on("change status", (data) => {
      handleChangeStatus(data);
    });

    return () => {
      socket.off("change status", handleChangeStatus);
    };
  }, []);

  useEffect(() => {
    async function getConvoNamesData() {
      if (activeConvo == null) return;
      const namesAndNicknamesData = await getNamesAndNicknames(activeConvo);

      dispatch(setNamesAndNicknames(namesAndNicknamesData));
    }
    getConvoNamesData();
  }, [activeConvo]);

  useEffect(() => {
    // remove members from redux
    const handleUpdateNickname = (data) => {
      // Messages will be updated if the sent messages is for the current conversation

      // Removes the member from the current list of active members

      if (!data.isGroup) {
        if (user._id == data.updateUserConvo1.user._id) {
          dispatch(
            updateAConvoConvoName([
              data.updateUserConvo1._id,
              data.updateUserConvo1.conversationName,
            ])
          );
          dispatch(setCurrentConvoName(data.updateUserConvo1.conversationName));
        } else {
          dispatch(
            updateAConvoConvoName([
              data.updateUserConvo2._id,
              data.updateUserConvo2.conversationName,
            ])
          );
          dispatch(setCurrentConvoName(data.updateUserConvo2.conversationName));
        }
      }

      if (namesAndNicknames) {
        for (let i = 0; i < namesAndNicknames.length; i++) {
          if (namesAndNicknames[i]._id == data.userConvoId) {
            dispatch(updateANickname([i, data.newNickname]));
          }
        }
      }
    };
    socket.on("update nickname", (data) => {
      handleUpdateNickname(data);
    });

    return () => {
      socket.off("update nickname", handleUpdateNickname);
    };
  }, [activeConvo, namesAndNicknames]);

  useEffect(() => {
    // remove members from redux
    const handleRemoveMember = (data) => {
      // Messages will be updated if the sent messages is for the current conversation

      // Removes the member from the current list of active members

      dispatch(updateAGroupConvo(data.conversationData));
      dispatch(setActiveConvoMembers(data.conversationData.users));

      // This should scroll down the chat ui if the user is the sender (NEEDS TO BE FIXED)
      // UPDATES THE CONVERSATION LIST
    };
    socket.on("remove member", (data) => {
      handleRemoveMember(data);
    });

    return () => {
      socket.off("remove member", handleRemoveMember);
    };
  }, [activeConvo]);

  useEffect(() => {
    if (!activeDirectUser) return;

    function checkStatus(friendId) {
      const matchedFriend = allFriends.find(
        (data) => data.friend._id == friendId
      );
    }

    checkStatus(activeDirectUser);
  }, [activeConvo, activeDirectUser, allFriends]);

  function isOnline(friendId) {
    const matchedFriend = allFriends.find(
      (data) => data.friend._id == friendId
    );

    return matchedFriend?.friend.status === "online";
  }

  // useEffect(() => {
  //   if (!activeDirectUser) return;

  //   checkStatus(activeDirectUser);
  //   console.log("the active direct user id:", activeDirectUser);
  // }, [activeConvo, activeDirectUser, allFriends]);

  useEffect(() => {
    const handleUpdateConversation = (data) => {
      if (data.updatedConversation.isGroup) {
        dispatch(updateAGroupConvo(data.updatedConversation));
        if (activeConvo == data.updatedConversation._id) {
          dispatch(
            setCurrentConvoName(data.updatedConversation.conversationName)
          );

          dispatch(setCurrentConvoImage(data.updatedConversation.gcImageUrl));

          dispatch(setUnifiedEmojiBtn(data.updatedConversation.unifiedEmoji));
        }
      } else {
        console.log("the updated conversation chu:", data.updatedConversation);
        dispatch(updateAConvo(data.updatedConversation));

        if (activeConvo == data.updatedConversation._id) {
          dispatch(setUnifiedEmojiBtn(data.updatedConversation.unifiedEmoji));
        }
      }

      if (data.messageData) {
        if (data.messageData.sender._id === user._id) {
          dispatch(setInitialMessageRender(true));
        }
        if (activeConvo == data.messageData.conversation) {
          dispatch(updateDisplayedMessages(data.messageData));
        }
        setImages([]);
        setFiles([]);
        setImageBuffers([]);
        setImageInputKey(Date.now());
      }
    };

    socket.on("update conversation", handleUpdateConversation);

    return () => {
      socket.off("update conversation", handleUpdateConversation);
    };
  }, [activeConvo, socket]);

  useEffect(() => {
    const handleCreateMessage = (data) => {
      if (data.messageData.sender._id === user._id) {
        dispatch(setInitialMessageRender(true));
      }
      if (activeConvo == data.messageData.conversation) {
        dispatch(updateDisplayedMessages(data.messageData));
      }

      console.log("message data:", data.messageData);

      setImages([]);
      setFiles([]);
      setImageBuffers([]);
      setImageInputKey(Date.now());
    };
    socket.on("create message", (data) => handleCreateMessage(data));

    return () => {
      socket.off("create message", handleCreateMessage);
    };
  }, [activeConvo]);

  useEffect(() => {
    // Check if there is a targeted message to scroll into
    if (!targetScrollMessageId || targetScrollMessageId == "") return;

    // Waits until the DOM is finished updating
    const timeout = setTimeout(() => {
      const el = document.getElementById(targetScrollMessageId);

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        dispatch(setTargetScrollMessageId(""));
      } else {
        console.log("no existing message element!");
      }
    }, 0); // defer until after render

    return () => clearTimeout(timeout);
  }, [displayedMessages, targetScrollMessageId]);

  // This will handle notification emits
  useEffect(() => {
    const handleReceiveNotification = (data) => {
      console.log("the notification data:", data);
      dispatch(addNotification(data));

      if (!data.isMuted) {
        const audio = new Audio("audios/notif.wav");
        audio.play().catch((err) => {
          console.log("error playing notification sound:", err);
        });
      }

      // Play notification sound
    };
    socket.on("receive notification", (data) => {
      if (!notifActive) {
        handleReceiveNotification(data);
      }
    });

    return () => {
      socket.off("receive notification", handleReceiveNotification);
    };
  }, []);

  // This will add a new group conversation to the collection in the navbar
  useEffect(() => {
    const handleAddGroupConversation = (data) => {
      dispatch(addGroupConversation(data.userConversation));
    };
    socket.on("invite groupchat", handleAddGroupConversation);

    return () => {
      socket.off("invite groupchat", handleAddGroupConversation);
    };
  }, []);

  // This will add a chat conversation for the other party
  useEffect(() => {
    const handleChatAUser = (data) => {
      console.log("chatting with user:", data);
      dispatch(addANewConvo(data.userConversation));
    };
    socket.on("chat user", handleChatAUser);

    return () => {
      socket.off("chat user", handleChatAUser);
    };
  }, []);

  useEffect(() => {
    const handleMessageReact = (data) => {
      dispatch(updateMessage(data.message));
    };

    socket.on("message react", handleMessageReact);

    return () => {
      socket.off("message react", handleMessageReact);
    };
  }, []);

  useEffect(() => {
    // Get the freinds of the current user

    // getNonFriends();
    socket.on("chat message", (data) => {
      // Messages will be updated if the sent messages is for the current conversation

      console.log("chatted:", data.msg);
      if (data.msg.sender._id === user._id) {
        dispatch(setInitialMessageRender(true));
      }

      if (activeConvo == data.convo._id) {
        dispatch(updateDisplayedMessages(data.msg));
        dispatch(addToMediaFiles(data.msg.fileUrls));
        dispatch(addToMediaImages(data.msg.imageUrls));
      }

      setImages([]);
      setFiles([]);
      setImageBuffers([]);
      setImageInputKey(Date.now());

      // This should scroll down the chat ui if the user is the sender (NEEDS TO BE FIXED)

      // UPDATES THE CONVERSATION LIST
      if (!data.isGroup) {
        dispatch(updateAConvo(data.convo));
      } else {
        dispatch(updateAGroupConvo(data.convo));
      }

      // UPDATES THE GROUP CONVERATION LIST
    });

    return () => {
      socket.off("chat message"); // Clean up on unmount
    };
  }, [activeConvo]);

  useEffect(() => {
    const isNearBottom =
      uiChatRef.current?.scrollHeight -
        uiChatRef.current?.clientHeight -
        uiChatRef.current?.scrollTop <
      50; // 50px tolerance

    if (isNearBottom) {
      uiChatRef.current?.scrollTo({
        top: uiChatRef.current.scrollHeight, // Scrolls to the very bottom
      });

      dispatch(setInitialMessageRender(false));
    }

    setImages([]);
    setFiles([]);
    setImageBuffers([]);
  }, [displayedMessages]);

  useEffect(() => {}, [mediaImages]);
  useEffect(() => {}, [imageBuffers]);

  // Adds a loading screen if all conversations are not yet retrieved.
  // if (!allInboxConversation) {
  //   return <div>Loading...</div>;
  // }

  async function sendEmojiMessage(unifiedEmoji) {
    inputRef.current.innerHTML = null;

    const emojiMessage = unifiedToEmoji(unifiedEmoji);
    const newMessage = await createMessage({
      message: emojiMessage,
      sender: user._id,
      conversation: activeConvo,
      mentions: toMention,
      latestMessage: emojiMessage,
    });

    console.log("the new message created:", newMessage);

    socket.emit("chat message", {
      messageId: newMessage._id,
    });

    dispatch(setToMention([]));
  }

  function unifiedToEmoji(unified) {
    return unified
      .split("-")
      .map((u) => String.fromCodePoint(parseInt(u, 16)))
      .join("");
  }

  async function sendMessage(e) {
    e.preventDefault();
    setInputMessage("");
    const allMentionSpans = inputRef.current.querySelectorAll(".mention-span");

    const latestMessage = inputRef.current.textContent.trim();
    allMentionSpans.forEach((span) => {
      span.textContent = `@[${span.dataset.memberId}:${span.dataset.username}]`;
    });

    const messageToSend = inputRef.current.textContent.trim();
    inputRef.current.innerHTML = null;
    // IN THE IOCONTROLLER, CHECK IF THE CONVERSATION IS ARCHIVED, IF SO, MOVE IT TO ACTIVE AGAIN

    if (messageToSend == "" && imageBuffers.length == 0 && files.length == 0)
      return;

    const newMessage = await createMessage({
      message: messageToSend,
      sender: user._id,
      conversation: activeConvo,
      mentions: toMention,
      latestMessage: latestMessage,
      images: images,
      files: files,
    });

    socket.emit("chat message", {
      messageId: newMessage._id,
    });

    if (newMessage.mentions.length > 0) {
      toMention.forEach((userId) => {
        socket.emit("send notification", {
          message: `${user.username} mentioned you in the group chat.`,
          receiver: userId,
          notification_type: "mention",
          conversation: activeConvo,
          messageId: newMessage._id,
        });
      });
    }

    dispatch(setToMention([]));
  }

  // Adds the emoji to the message input
  function addEmojiToInput(emoji) {
    dispatch(setEmojiPickerIsOpen(true));

    inputRef.current.innerHTML += emoji.emoji;
  }

  // This will activate the event of the file picker
  function handleImageInputClick() {
    imageInputRef.current.click();
  }
  function handleFileInputClick() {
    fileInputRef.current.click();
  }

  async function joinGroup() {
    activateUserConversation(activeUserConvo);
    dispatch(setConversationStatus("active"));
    dispatch(activateGroupConversation(activeUserConvo));
  }

  async function leaveGroup() {
    // Delete the user conversation in the redux array
    dispatch(removeAConvo(activeUserConvo));
    // set the conversation to loading (for now)
    dispatch(setMessageIsLoading(true));

    // set the conversation as active by default for now
    dispatch(setConversationStatus("active"));
    // Delete the user conversation in the db
    leaveConversation(activeUserConvo);
  }

  async function chatAFriend(friendId) {
    const response = await findConvoWithUser(friendId);

    // This will get the messages using the id of the response, since if the conversation exists, it's in the allInboxConversation array
    // Create a conversation with the friend if no convo exists
    if (response.length == 0) {
      const newConvo = await createConversation([user._id, friendId], false);
      getMessages(newConvo._id, newConvo.convoName);
      dispatch(addANewConvo(newConvo));
      return newConvo._id;
    }

    dispatch(setConversationRole("member"));
    getMessages(
      response[0]._id,
      response[0].convoName,
      response[0].userConvoId,
      response[0].status
    );
    dispatch(setCurrentConvoImage(response[0].profilePictureUrl));
    return response[0]._id;
  }

  async function getMessages(convoId, convoName, userConvoId, convoStatus) {
    // Join a channel for users in the same conversation
    const messages = await getAllUserMessages(convoId);
    let allImages = [];
    let allFiles = [];
    messages.forEach((messageData) => {
      allImages = [...allImages, ...messageData.imageUrls];
      allFiles = [...allFiles, ...messageData.fileUrls];
    });

    dispatch(setMediaImages(allImages));
    dispatch(setMediaFiles(allFiles));

    dispatch(setActiveConversation([convoName, convoId, userConvoId]));
    dispatch(initDisplayedMessages(messages));
    dispatch(setMessageIsLoading(false));
    dispatch(setConversationStatus(convoStatus));
  }

  async function handleImagesChange(e) {
    // Get the array of files selected by the user
    const selectedFiles = Array.from(e.target.files);

    e.target.value = "";
    console.log("fuck shit?:", [...images, ...files, ...selectedFiles].length);
    if ([...images, ...files, ...selectedFiles].length > 10) {
      alert("You can only send up to 10 items at a time!");

      return;
    }
    // Resets the value of the input files (This way, you can add the image you previously selected);

    // const blobUrls = selectedFiles.map((file) => URL.createObjectURL(file));

    console.log("all selected files:", selectedFiles);
    const selectedFilesBuffer = await Promise.all(
      selectedFiles.map((image) => {
        if (image.type.startsWith("image/")) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(image);
            reader.onload = () => resolve(reader.result);
          });
        }
        return;
      })
    );

    setImages((prev) => [...prev, ...selectedFiles]);
    setImageBuffers((prev) => [...prev, ...selectedFilesBuffer]);
  }
  async function handleFilesChange(e) {
    // Get the array of files selected by the user
    const selectedFiles = Array.from(e.target.files);

    e.target.value = "";
    if ([...images, ...files, ...selectedFiles].length > 10) {
      alert("You can only send up to 10 items at a time!");

      return;
    }

    console.log("all files:", selectedFiles);
    setFiles((prev) => [...prev, ...selectedFiles]);
  }

  function getElementBeforeCursor(range) {
    const { startContainer, startOffset } = range;

    let node;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      // If inside a text node, try previous sibling or parent
      node =
        startOffset > 0
          ? startContainer
          : startContainer.previousSibling || startContainer.parentNode;
    } else {
      // If in an element node, get the child before the cursor
      node = startContainer.childNodes[startOffset - 1] || startContainer;
    }

    // Traverse up or left to find an element node
    while (node && node.nodeType !== Node.ELEMENT_NODE) {
      node = node.previousSibling || node.parentNode;
    }

    return node;
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
    setImageBuffers((prev) => prev.filter((_, index) => index !== idx));
    setImages((prev) => prev.filter((_, index) => index !== idx));
  }
  function removeFile(idx) {
    setFiles((prev) => prev.filter((_, index) => index !== idx));
  }

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Overlays */}

        <BlockOverlay />
        <NicknamesOverlay />
        <ChangeEmojiOverlay />
        <ChangeChatNameOverlay />
        <ProfileOverlay />
        <ReactionsOverlay />
        <AddMemberOverlay />
        <SettingsOverlay />
        <CreateGroupChatOverlay />
        <Navbar />
        <EditProfileOverlay />
        {/* Main Content */}
        <div className="flex flex-grow min-h-0 relative">
          <Overlay />

          {/* Sidebar */}

          <Sidebar
            inputRef={inputRef}
            getMessages={getMessages}
            chatAFriend={chatAFriend}
          />

          {/* Chat Interface */}
          <div className="flex flex-grow flex-col w-4xl bg-gray-50 h-full">
            <div className="border-b-8-gray-800 flex p-3 items-center gap-5 px-10 bg-white">
              {currentConvoImage != "" && (
                <img
                  src={currentConvoImage ? currentConvoImage : ""}
                  className="rounded-full w-12 h-12 border-1"
                />
              )}

              <div>
                <p className="font-bold text-md">{currentConvoName}</p>
                <p
                  className={`${
                    !activeConvoIsGroup && activeConvo && userIsFriend
                      ? "block"
                      : "hidden"
                  } ${
                    isOnline(activeDirectUser)
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {isOnline(activeDirectUser) ? "Online" : "Offline"}
                </p>
              </div>
              <div className="flex gap-5 ml-auto items-center justify-center">
                {/* Voice Call Button */}
                {/* <button className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    width="25"
                    height="25"
                    fill="black"
                  >
                    <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
                  </svg>
                </button> */}

                {/* Video Call Button */}
                {/* <button className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    width="25"
                    height="25"
                    fill="black"
                  >
                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z" />
                  </svg>
                </button> */}

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
              {activeConvo == null ? (
                <div
                  className={`w-full h-full bg-gray-50 flex justify-center items-center`}
                >
                  <h1 className="text-gray-500 text-3xl font-semibold">
                    Looks quiet here...
                  </h1>
                </div>
              ) : (
                <MessagesContainer uiChatRef={uiChatRef} />
              )}
            </div>

            <div>
              <div
                className={`p-2 flex gap-3 overflow-x-scroll ${
                  imageBuffers.length == 0 && files.length == 0
                    ? "hidden"
                    : "visible"
                }`}
              >
                {imageBuffers.map((img, idx) => (
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
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 gap-1 rounded-md bg-gray-100 flex-shrink-0 flex items-center"
                  >
                    <button
                      onClick={() => {
                        removeFile(idx);
                      }}
                      id={idx}
                      className="absolute backdrop-blur-2xl bg-white -right-1 -top-1 rounded-full border-white w-4 h-4 flex items-center justify-center cursor-pointer text-xs"
                    >
                      x
                    </button>
                    <p>{file.name}</p>

                    <div className="bg-gray-300 rounded-full p-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        width="25"
                        height="25"
                        fill="black"
                      >
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div
                className={`${
                  activeConvoIsGroup && isMentioning ? "flex" : "hidden"
                } p-3 flex flex-col gap-3 max-h-60 overflow-y-scroll shadow-lg absolute bottom-full bg-gray-50 w-200 mb-2`}
              >
                {/* Move to a separate component */}
                {filteredConvoMembers &&
                  filteredConvoMembers.map((member, idx) => {
                    if (member._id === user._id) return;
                    return (
                      <MentionCard
                        key={idx}
                        member={member}
                        inputRef={inputRef}
                      />
                    );
                  })}
              </div>

              {/* Prompt to join group if user is pending */}
              {conversationStatus == "pending" && (
                <div className="flex justify-center mb-5">
                  <div className="shadow-xl bg-blue-50 p-3 rounded-lg">
                    <div className="flex gap-2 items-center">
                      <p>Join Group?</p>
                      <button
                        className="bg-blue-300 px-3 py-2 rounded-lg cursor-pointer"
                        onClick={(e) => joinGroup()}
                      >
                        Yes
                      </button>
                      <button
                        className="bg-red-300 px-3 py-2 rounded-lg cursor-pointer"
                        onClick={(e) => leaveGroup()}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form
                onSubmit={(e) => sendMessage(e)}
                className="flex mt-auto p-3 bg-white border-t-0.5 border-gray-500"
              >
                <>
                  <div>
                    <input
                      key={imageInputKey}
                      type="file"
                      ref={imageInputRef}
                      accept="image/*"
                      onChange={handleImagesChange}
                      multiple
                      hidden
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
                      onChange={handleFilesChange}
                      multiple
                      hidden
                    />
                  </div>
                  {/* Image input button */}
                  <button
                    type="button"
                    className={"cursor-pointer"}
                    disabled={conversationStatus == "archived"}
                    onClick={handleImageInputClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      width="30"
                      height="30"
                      fill="black"
                    >
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                    </svg>
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      width="30"
                      height="30"
                      fill="black"
                    >
                      <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
                    </svg> */}
                  </button>

                  {/* File Input Button */}
                  <button
                    type="button"
                    className={"cursor-pointer"}
                    disabled={conversationStatus == "archived"}
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
                  <div
                    ref={inputRef}
                    className={`flex-1 max-h-50 overflow-y-scroll mx-4 p-2 ml-0
                      text-black
                    `}
                    // if user presses space, check if it is mentioning, it is.. then create a new span and move the caret
                    // Might revise to check if the span is a mention span instead
                    onPaste={(e) => {
                      e.preventDefault();
                      const newSpan = document.createElement("span");
                      newSpan.textContent = e.clipboardData.getData("text");

                      inputRef.current.appendChild(newSpan);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage(e);
                        return;
                      }

                      // This is used for checking key events when the user is having a conversation in a group chat
                      if (activeConvoIsGroup) {
                        if (e.key === "Backspace") {
                          const selection = window.getSelection();
                          if (!selection.rangeCount) return;
                          const range = selection.getRangeAt(0);
                          const nodeBeforeCursor =
                            getElementBeforeCursor(range);
                          console.log(
                            "the node before the cursor:",
                            nodeBeforeCursor
                          );
                          if (
                            nodeBeforeCursor.classList?.contains("mention-span")
                          ) {
                            nodeBeforeCursor.remove();
                            dispatch(setIsMentioning(false));
                            dispatch(
                              removeToMention(nodeBeforeCursor.dataset.memberId)
                            );
                          }

                          if (
                            inputRef.current.textContent[
                              inputRef.current.textContent.length - 1
                            ] == "@"
                          ) {
                            dispatch(setIsMentioning(false));
                            return;
                          }
                        }

                        if (e.key === " ") {
                          const selection = window.getSelection();
                          if (!selection.rangeCount) return;
                          const range = selection.getRangeAt(0);
                          const nodeBeforeCursor =
                            getElementBeforeCursor(range);
                          console.log(
                            "the node before the cursor:",
                            nodeBeforeCursor
                          );
                          if (
                            nodeBeforeCursor.classList?.contains("mention-span")
                          ) {
                            e.preventDefault();
                            const blankSpan = document.createElement("span");
                            blankSpan.textContent = "\u00A0";
                            inputRef.current.appendChild(blankSpan);

                            const range = document.createRange();

                            const selection = window.getSelection();

                            range.setStart(blankSpan, 0);
                            range.setEnd(
                              blankSpan,
                              blankSpan.textContent.length
                            );
                            range.collapse(false);

                            selection.removeAllRanges();

                            selection.addRange(range);

                            inputRef.current.focus();
                            return;
                          }
                        }
                        if (e.key === "@") {
                          const selection = window.getSelection();
                          const range = selection.getRangeAt(0);
                          const nodeBeforeCursor =
                            getElementBeforeCursor(range);

                          if (
                            nodeBeforeCursor.classList?.contains("mention-span")
                          ) {
                          } else {
                            const lastChar =
                              inputRef.current.textContent.slice(-1);
                            console.log(
                              "Last char:",
                              JSON.stringify(lastChar),
                              "Char code:",
                              lastChar?.charCodeAt(0)
                            );

                            console.log("THE LAST CHARACTER:", lastChar);
                            if (
                              lastChar === " " ||
                              lastChar === "\u00A0" ||
                              lastChar === "\n" ||
                              lastChar === "\t" ||
                              (inputRef.current.textContent.length == 0 &&
                                activeConvoIsGroup)
                            ) {
                              dispatch(setIsMentioning(true));
                              return;
                            } else {
                              dispatch(setIsMentioning(false));
                            }

                            return;
                          }
                        }

                        const selection = window.getSelection();
                        const range = selection.getRangeAt(0);
                        const nodeBeforeCursor = getElementBeforeCursor(range);
                        console.log(
                          "the node before the cursor:",
                          nodeBeforeCursor
                        );
                        if (
                          nodeBeforeCursor.classList?.contains(
                            "mention-span"
                          ) &&
                          e.key.length === 1
                        ) {
                          e.preventDefault();
                          const newSpan = document.createElement("span");
                          newSpan.textContent = e.key;
                          inputRef.current.appendChild(newSpan);

                          const selection = window.getSelection();

                          const range = document.createRange();

                          range.setStart(newSpan, 0);
                          range.setEnd(newSpan, newSpan.textContent.length);
                          range.collapse(false);
                          selection.removeAllRanges();
                          selection.addRange(range);
                          inputRef.current.focus();
                        }
                      }
                    }}
                    onKeyUp={(e) => {
                      if (activeConvoIsGroup) {
                        if (activeConvoIsGroup) {
                          const indexOfAtSign =
                            inputRef.current.textContent.lastIndexOf("@");
                          const filter = inputRef.current.textContent
                            .slice(indexOfAtSign + 1)
                            .split(" ")[0];

                          console.log("THE FILTER:", filter);

                          dispatch(
                            setFilteredConvoMembers(filter.toLowerCase())
                          );
                          return;
                        }

                        if (e.key === "Backspace") {
                          const selection = window.getSelection();
                          if (!selection.rangeCount) {
                            return;
                          }
                          const range = selection.getRangeAt(0);
                          const nodeBeforeCursor =
                            getElementBeforeCursor(range);
                          console.log(
                            "the node before the cursor:",
                            nodeBeforeCursor
                          );

                          console.log(
                            "current input length:",
                            inputRef.current.textContent.length
                          );
                          // if the text content is blank
                          if (inputRef.current.textContent.length == 0) {
                            return;
                          }
                          // Opens the mention user list if the last character is an @ sign
                          if (
                            inputRef.current.textContent[
                              inputRef.current.textContent.length - 1
                            ] == "@"
                          ) {
                            dispatch(setIsMentioning(true));
                            dispatch(setFilteredConvoMembers(""));
                            return;
                          }
                        }
                      }
                    }}
                    onInput={(e) => setInputMessage(e.target.textContent)}
                    contentEditable={conversationStatus != "archived"}
                    suppressContentEditableWarning={true}
                  ></div>

                  <div className="flex items-center justify-center ml-auto gap-5">
                    <div className="relative inline-block">
                      <div
                        id="emoji-picker"
                        className={`absolute bottom-full mb-2 left-0 z-10 ${
                          emojiPickerIsOpen ? "block" : "hidden"
                        }`}
                      >
                        <EmojiPicker
                          onEmojiClick={addEmojiToInput}
                          open={true}
                        />
                      </div>

                      <div className="flex gap-1">
                        {/* <Emoji unified="1f423" size="25" /> */}
                        <button
                          type="button"
                          onClick={(e) => {
                            dispatch(setEmojiPickerIsOpen(!emojiPickerIsOpen));
                          }}
                          className="cursor-pointer"
                          disabled={conversationStatus == "archived"}
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

                        {inputMessage == "" &&
                        images.length == 0 &&
                        files.length == 0 ? (
                          <span
                            className="cursor-pointer"
                            onClick={(e) => {
                              sendEmojiMessage(unifiedEmojiBtn);
                            }}
                          >
                            <Emoji
                              unified={unifiedEmojiBtn}
                              size="30"
                              onClick={(e) => console.log("AHHHH")}
                            />
                          </span>
                        ) : (
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
                        )}
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
