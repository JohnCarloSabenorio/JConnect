import { useState, useContext, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsHidden } from "../redux/overlay";
import { setHideAddMemberOverlay } from "../redux/addMemberOverlay";
import ConversationMembersCard from "./ConversationMembersCard";
import { setChangeChatNameOverlayIsOpen } from "../redux/changeChatNameOverlay";
import { setDisplayChangeEmojiOverlay } from "../redux/changeEmojiOverlay";
import { setDisplayNicknamesOverlay } from "../redux/nicknamesOverlay";
import { UserContext } from "../App";
import { updateConversation } from "../api/conversation";
import { socket } from "../socket";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { updateUserConversation } from "../api/conversation";
import { setDisplayBlockOverlay } from "../redux/overlay";
import "react-photo-view/dist/react-photo-view.css";
import {
  setConversationStatus,
  updateConvoStatus,
  updateConvoStatusGroup,
} from "../redux/conversation";
import { setDisplayMediaPanel } from "../redux/media";
export default function MediaPanel({ getUserConversations }) {
  const {
    currentConvoName,
    currentConvoImage,
    activeConvoIsGroup,
    userIsFriend,
    activeConvo,
    activeUserConvo,
    activeConvoMembers,
    activeConvoIsArchived,
    conversationStatus,
  } = useSelector((state) => state.conversation);
  const { user } = useContext(UserContext);

  const dispatch = useDispatch();
  const { mediaImages, mediaFiles, displayMediaPanel, displayCloseMediaBtn } =
    useSelector((state) => state.media);

  const { isDarkMode } = useSelector((state) => state.isDarkMode);
  const [imagesActive, setImagesActive] = useState(false);
  const [filesActive, setFilesActive] = useState(false);
  const [customizeActive, setCustomizeActive] = useState(false);
  const [chatInfoActive, setChatinfoActive] = useState(false);
  const [membersActive, setMembersActive] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isGroup, setIsGroup] = useState(false);

  const changePhotoRef = useRef();
  function handleChangePhotoClick() {
    changePhotoRef.current.click();
  }

  async function handleUpdateNotification() {
    dispatch(setConversationStatus(isMuted ? "active" : "muted"));

    if (activeConvoIsGroup) {
      console.log("updating chuchu:");
      dispatch(
        updateConvoStatusGroup([activeUserConvo, isMuted ? "active" : "muted"])
      );
    } else {
      console.log("updating direct:", isMuted ? "active" : "muted");
      dispatch(
        updateConvoStatus([activeUserConvo, isMuted ? "active" : "muted"])
      );
    }

    const updatedUserConversation = await updateUserConversation(
      activeUserConvo,
      { status: isMuted ? "active" : "muted" }
    );

    setIsMuted((prev) => !prev);

    console.log("updated user conversation status:", updatedUserConversation);
  }

  async function handleChangePhotoUpdate(file) {
    console.log("new group photo file:", file);
    const formData = new FormData();
    formData.append("convoImage", file);

    const updatedConversation = await updateConversation(activeConvo, formData);

    console.log("changed group photo:", updatedConversation);

    socket.emit("update conversation", {
      conversationId: updatedConversation._id,
      message: `${user.username} has changed the group photo.`,
      member: user,
      action: "change_photo",
      data: {
        convoImage: updatedConversation.convoImage,
        latestMessage: `${user.username} has changed the group photo.`,
      },
    });
  }

  useEffect(() => {
    console.log("conversation status changed:", conversationStatus);
    setIsMuted(conversationStatus == "muted");
  }, [activeUserConvo]);

  return (
    <div
      className={`transition-colors ${
        isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
      } absolute border-0.5 w-full h-full overflow-y-scroll  [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-md" lg:relative lg:w-120 ${
        displayMediaPanel ? "block" : "hidden"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        className={`${
          isDarkMode ? "fill-gray-50" : "fill-gray-800"
        } w-9 h-9 absolute left-5 top-5 cursor-pointer ${
          displayCloseMediaBtn ? "block" : "hidden"
        }`}
        onClick={(e) => {
          dispatch(setDisplayMediaPanel(false));
        }}
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>
      <div className="flex flex-col items-center justify-center p-10 pb-5">
        {currentConvoImage && (
          <img
            src={currentConvoImage}
            className="bg-white rounded-full w-30 h-30 border-1"
            alt="conversation image"
          />
        )}
        <p className="font-bold text-lg">{currentConvoName}</p>
        {/* Media Panel Buttons */}
        <div className="flex justify-center gap-3 mt-5">
          {/* Notifications Button */}
          <button
            onClick={(e) => handleUpdateNotification()}
            className={`${
              activeConvoIsArchived ||
              conversationStatus == "blocked" ||
              activeConvo == null
                ? "hidden"
                : "flex"
            } cursor-pointer shadow-lg p-2 text-sm justify-center items-center rounded-full`}
          >
            {isMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                width="25"
                height="25"
                className={`${isDarkMode ? "fill-gray-50" : "fill-gray-800"}`}
              >
                <path d="M160-200v-80h80v-280q0-33 8.5-65t25.5-61l60 60q-7 16-10.5 32.5T320-560v280h248L56-792l56-56 736 736-56 56-146-144H160Zm560-154-80-80v-126q0-66-47-113t-113-47q-26 0-50 8t-44 24l-58-58q20-16 43-28t49-18v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v206Zm-276-50Zm36 324q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm33-481Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                width="25"
                height="25"
                className={`${isDarkMode ? "fill-gray-50" : "fill-gray-800"}`}
              >
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
            )}
          </button>

          {/* Block button */}

          <button
            className={`${
              activeConvo == null ||
              activeConvoIsGroup ||
              conversationStatus == "blocked" ||
              conversationStatus == "archived"
                ? "hidden"
                : "block"
            } cursor-pointer shadow-lg p-2 text-sm flex justify-center items-center rounded-full`}
            onClick={(e) => {
              dispatch(setDisplayBlockOverlay(true));
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              width="25"
              height="25"
              className={`${isDarkMode ? "fill-gray-50" : "fill-gray-800"}`}
            >
              <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z" />
            </svg>
          </button>

          {/* Archive Button */}
          <button
            onClick={() => dispatch(setIsHidden())}
            className={`${
              activeConvo == null || conversationStatus == "blocked"
                ? "hidden"
                : "block"
            } cursor-pointer shadow-lg p-2 text-sm flex justify-center items-center rounded-full`}
          >
            {activeConvoIsArchived ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                width="25"
                height="25"
                className={`${isDarkMode ? "fill-gray-50" : "fill-gray-800"}`}
              >
                <path d="M480-560 320-400l56 56 64-64v168h80v-168l64 64 56-56-160-160Zm-280-80v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                width="25"
                height="25"
                className={`${isDarkMode ? "fill-gray-50" : "fill-gray-800"}`}
              >
                <path d="m480-240 160-160-56-56-64 64v-168h-80v168l-64-64-56 56 160 160ZM200-640v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z" />
              </svg>
            )}
          </button>

          {/* Add Member Button */}

          {activeConvoIsGroup && (
            <button
              onClick={(e) => dispatch(setHideAddMemberOverlay(false))}
              className={`${
                activeConvo == null ? "hidden" : "flex"
              } cursor-pointer shadow-lg p-2 text-sm justify-center items-center rounded-full`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                width="25"
                height="25"
                className={`${isDarkMode ? "fill-gray-50" : "fill-gray-800"}`}
              >
                <path d="M500-482q29-32 44.5-73t15.5-85q0-44-15.5-85T500-798q60 8 100 53t40 105q0 60-40 105t-100 53Zm220 322v-120q0-36-16-68.5T662-406q51 18 94.5 46.5T800-280v120h-80Zm80-280v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Zm-480-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM0-160v-112q0-34 17.5-62.5T64-378q62-31 126-46.5T320-440q66 0 130 15.5T576-378q29 15 46.5 43.5T640-272v112H0Zm320-400q33 0 56.5-23.5T400-640q0-33-23.5-56.5T320-720q-33 0-56.5 23.5T240-640q0 33 23.5 56.5T320-560ZM80-240h480v-32q0-11-5.5-20T540-306q-54-27-109-40.5T320-360q-56 0-111 13.5T100-306q-9 5-14.5 14T80-272v32Zm240-400Zm0 400Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col p-3">
        <h1 className="font-bold mb-5">Chat Info</h1>

        {/* <input
          placeholder="Search in conversation"
          className="bg-white shadow-md p-1 rounded-full px-3"
          // style={{ fontFamily: "Arial", "FontAwesome" }}
        /> */}

        <div className="pt-3">
          {/* Customizing Chat */}
          <div
            className="p-3 flex shadow-md cursor-pointer"
            onClick={() => setCustomizeActive((prev) => !prev)}
          >
            <p className="align-middle">Customize Chat</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="30"
              height="30"
              className={`${
                isDarkMode ? "fill-gray-50" : "fill-gray-500"
              } ml-auto transition-transform ${
                customizeActive ? "rotate-180" : "rotate-0"
              }`}
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          </div>

          <div
            className={`p-3 flex flex-col ${
              !customizeActive || conversationStatus == "blocked"
                ? "hidden"
                : "block"
            }`}
          >
            {/* Change Chat Name */}
            <div
              onClick={(e) => {
                if (activeConvo == null) return;
                dispatch(setChangeChatNameOverlayIsOpen(true));
              }}
              className={`${
                activeConvoIsGroup ? "flex" : "hidden"
              } group  gap-2 p-1 cursor-pointer hover:bg-gray-500 rounded-md hover:text-white`}
            >
              {/* Icon */}
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  width="25"
                  height="25"
                  className={`group-hover:fill-white ${
                    isDarkMode ? "fill-gray-50" : "fill-gray-700"
                  }`}
                >
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                </svg>
              </div>
              {/* Text */}
              <div>Change Chat Name</div>
            </div>

            {/* Change Photo */}
            <input
              type="file"
              id="change-photo"
              name="change-photo"
              ref={changePhotoRef}
              className="hidden"
              onChange={(e) => handleChangePhotoUpdate(e.target.files[0])}
            />
            <div
              onClick={(e) => {
                if (activeConvo == null) return;
                handleChangePhotoClick();
              }}
              className={`group ${
                activeConvoIsGroup ? "flex" : "hidden"
              } gap-2 p-1 cursor-pointer hover:bg-gray-500 rounded-md hover:text-white`}
            >
              {/* Icon */}
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  width="25"
                  height="25"
                  className={`group-hover:fill-white ${
                    isDarkMode ? "fill-gray-50" : "fill-gray-700"
                  }`}
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                </svg>
              </div>
              {/* Text */}
              <div>Change Photo</div>
            </div>

            {/* Change Emoji */}
            <div
              onClick={(e) => {
                if (activeConvo == null) return;
                dispatch(setDisplayChangeEmojiOverlay(true));
              }}
              className={`group ${
                activeConvoIsGroup ? "flex" : "hidden"
              } gap-2 p-1 cursor-pointer hover:bg-gray-500 rounded-md hover:text-white`}
            >
              {/* Icon */}
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  width="25"
                  height="25"
                  className={`group-hover:fill-white ${
                    isDarkMode ? "fill-gray-50" : "fill-gray-700"
                  }`}
                >
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                </svg>
              </div>
              {/* Text */}
              <div>Change Emoji</div>
            </div>

            {/* Change Nickname */}
            <div
              onClick={(e) => {
                if (activeConvo == null) return;
                dispatch(setDisplayNicknamesOverlay(true));
              }}
              className="group flex gap-2 p-1 cursor-pointer hover:bg-gray-500 rounded-md hover:text-white"
            >
              {/* Icon */}
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  width="25"
                  height="25"
                  className={`group-hover:fill-white ${
                    isDarkMode ? "fill-gray-50" : "fill-gray-700"
                  }`}
                >
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                </svg>
              </div>
              {/* Text */}
              <div>Change Nickname</div>
            </div>
          </div>

          {/* Group members list */}
          <div
            className={`p-3 flex shadow-md cursor-pointer ${
              activeConvoIsGroup ? "block" : "hidden"
            }`}
            onClick={() => setMembersActive((prev) => !prev)}
          >
            <p className="align-middle">Members</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="30"
              height="30"
              className={`${
                isDarkMode ? "fill-gray-50" : "fill-gray-500"
              } ml-auto transition-transform ${
                membersActive ? "rotate-180" : "rotate-0"
              }`}
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          </div>

          <div
            className={`p-3 flex flex-col gap-3 ${
              membersActive ? "block" : "hidden"
            }`}
          >
            {activeConvoMembers &&
              activeConvoMembers.map((member, idx) => {
                return <ConversationMembersCard member={member} key={idx} />;
              })}
          </div>

          {/* Files */}
          <div
            className="p-3 flex shadow-md cursor-pointer"
            onClick={() => setFilesActive((prev) => !prev)}
          >
            <p className="align-middle">Files</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="30"
              height="30"
              className={`${
                isDarkMode ? "fill-gray-50" : "fill-gray-500"
              } ml-auto transition-transform ${
                filesActive ? "rotate-180" : "rotate-0"
              }`}
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          </div>

          <div
            className={`flex flex-col gap-2 rounded-md overflow-hidden transition-all duration-500 ${
              !filesActive || conversationStatus == "blocked"
                ? "hidden"
                : "block"
            }`}
          >
            {mediaFiles.map((file, idx) => (
              <a
                className="group"
                href={file.storagename}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
              >
                <div className="bg-gray-100 p-3 rounded-md cursor-pointer">
                  <p className="group-hover:underline">{file.originalname}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Div for toggling list of images */}
          <div
            className="p-3 flex shadow-md cursor-pointer"
            onClick={() => {
              setImagesActive((prev) => !prev);
            }}
          >
            <p className="align-middle">Images</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="30"
              height="30"
              className={`${
                isDarkMode ? "fill-gray-50" : "fill-gray-500"
              } ml-auto transition-transform ${
                imagesActive ? "rotate-180" : "rotate-0"
              }`}
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          </div>
          <div
            className={`grid grid-cols-3 rounded-md overflow-hidden transition-all duration-500 ${
              !imagesActive || conversationStatus == "blocked"
                ? "hidden"
                : "block"
            }`}
          >
            <PhotoProvider>
              {mediaImages.map((imageBlob, idx) => (
                <PhotoView src={imageBlob} key={idx}>
                  <img
                    src={imageBlob}
                    className="aspect-square object-cover cursor-pointer"
                  ></img>
                </PhotoView>
              ))}
            </PhotoProvider>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
