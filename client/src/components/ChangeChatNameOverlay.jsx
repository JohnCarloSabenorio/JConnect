import { act, useEffect, useState } from "react";
import { setChangeChatNameOverlayIsOpen } from "../redux/changechatname_overlay";
import { useSelector, useDispatch } from "react-redux";
import { setConversationName } from "../redux/chat";
import { socket } from "../socket";
export default function ChangeChatNameOverlay() {
  const dispatch = useDispatch();

  const [newConversationName, setNewConversationName] = useState("");

  const { changeChatNameOverlayIsOpen } = useSelector(
    (state) => state.changeChatNameOverlay
  );
  const { activeConvo } = useSelector((state) => state.conversation);

  const inputLength = 500;
  return (
    <>
      <div
        className={`${
          changeChatNameOverlayIsOpen ? "block" : "hidden"
        } absolute w-full h-full z-20 bg-black/70  justify-center items-center flex-col flex
        }`}
      >
        <div className="bg-white p-5 rounded-md w-lg">
          <div>
            <p>Edit Conversation Name</p>
            <p></p>
          </div>
          <div>
            <input
              type="text"
              maxLength={inputLength}
              onInput={(e) => setNewConversationName(e.target.value)}
              value={newConversationName}
              className="w-full py-2 px-3 mt-3 border-2 rounded-md border-gray-600"
            />
          </div>
          <div className="flex justify-end gap-3 mt-3">
            <button
              className="bg-gray-200 py-2 px-3 rounded-md cursor-pointer"
              onClick={(e) => {
                dispatch(setChangeChatNameOverlayIsOpen(false));
                setNewConversationName("");
              }}
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                socket.emit("update conversation", {
                  conversationId: activeConvo,
                  data: {
                    conversationName: newConversationName,
                  },
                });
              }}
              className="bg-blue-400 text-white py-2 px-3 rounded-md cursor-pointer"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
