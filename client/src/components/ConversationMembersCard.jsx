import { socket } from "../socket";
import { removeMemberFromGroup } from "../api/conversation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function ConversationMembersCard({ member }) {
  const [menuIsActive, setMenuIsActive] = useState(false);
  const [displayMemberCard, setDisplayMemberCard] = useState(true);
  const { activeConvo } = useSelector((state) => state.conversation);
  async function removeMember(conversationId, member) {
    // remove member in real-time
    setMenuIsActive(false);
    setDisplayMemberCard(false);
    socket.emit("remove member", { conversationId, member });
  }

  return (
    <div
      className={`${
        displayMemberCard ? "flex" : "hidden"
      } justify-between p-1 cursor-pointer items-center gap-5 w-full`}
    >
      <div className="flex items-center gap-5">
        {/* Profile Image */}
        <img src="img/avatar.png" className="w-13 h-13"></img>

        {/* Text */}
        <p>{member.username}</p>
      </div>
      <div className="relative">
        <button className="cursor-pointer rounded-full hover:bg-gray-200 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="gray"
            className="w-7 h-7"
            onClick={(e) => setMenuIsActive((prev) => !prev)}
          >
            <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
          </svg>
        </button>
        <div
          className={`${
            menuIsActive ? "flex" : "hidden"
          } absolute z-50 top-full mt-3 right-0 rounded-sm w-50 bg-gray-50 shadow-lg origin-top duration-100 flex-col justify-start`}
        >
          <a className="hover:bg-blue-200 rounded-sm p-2">Message</a>
          <a className="hover:bg-blue-200 rounded-sm p-2">View Profile</a>
          <a
            onClick={(e) => removeMember(activeConvo, member)}
            className="hover:bg-blue-200 rounded-sm p-2"
          >
            Remove Member
          </a>
        </div>
      </div>
    </div>
  );
}
