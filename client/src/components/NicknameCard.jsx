import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserConversation } from "../api/conversation";
import { socket } from "../socket";
import { UserContext } from "../App";
import { useContext } from "react";
export default function NicknameCard({ userData }) {
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const [displayedNickname, setDisplayedNickname] = useState("");

  const { activeConvoMembers, activeConvo } = useSelector(
    (state) => state.conversation
  );

  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState("");

  useEffect(() => {
    setDisplayedNickname(userData.nickname);
  }, [userData]);

  async function setNickname() {
    if (newNickname == displayedNickname) return;
    setDisplayedNickname(newNickname);

    socket.emit("update nickname", {
      userConvoId: userData._id,
      username: userData.user.username,
      newNickname,
      conversationId: activeConvo,
    });

    socket.emit("update conversation", {
      conversationId: activeConvo,
      message:
        newNickname != ""
          ? `${user.username} has set the nickname for ${userData.user.username} to ${newNickname}.`
          : `${user.username} cleared the nickname for ${userData.user.username}.`,
      member: user._id,
      action: "change_nickname",
      data: {
        latestMessage:
          newNickname != ""
            ? `${user.username} has set the nickname for ${userData.user.username} to ${newNickname}.`
            : `${user.username} cleared the nickname for ${userData.user.username}.`,
      },
    });
  }

  return (
    <div className="flex gap-3 mt-3 items-center px-2">
      {" "}
      <img src="img/avatar.png" className="w-15 h-15" alt="profile img" />
      <div className="flex-1">
        {/* Nickname */}
        {isEditing ? (
          <input
            type="text"
            className="w-full rounded-md border"
            onInput={(e) => setNewNickname(e.target.value)}
          />
        ) : (
          <p className="">{displayedNickname}</p>
        )}
        <p className="text-sm">{userData.user.username}</p>

        {/* <span className="text-md">Nickname</span> */}
        {/* Username */}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        className={`${isEditing ? "hidden" : "block"} w-7 h-7 cursor-pointer`}
        onClick={(e) => setIsEditing(true)}
      >
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        className={`${isEditing ? "block" : "hidden"} w-7 h-7 cursor-pointer`}
        onClick={(e) => {
          setIsEditing(false);
          setNickname();
        }}
      >
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
      </svg>
    </div>
  );
}
