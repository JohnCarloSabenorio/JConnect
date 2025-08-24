import EmojiPicker from "emoji-picker-react";
import { Emoji } from "emoji-picker-react";
import { useSelector, useDispatch } from "react-redux";
import { setDisplayChangeEmojiOverlay } from "../redux/changeEmojiOverlay";
import { setUnifiedEmojiBtn } from "../redux/conversation";
import { socket } from "../socket";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
export default function ChangeEmojiOverlay() {
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const { displayChangeEmojiOverlay } = useSelector(
    (state) => state.changeEmojiOverlay
  );

  const { unifiedEmojiBtn, activeConvo } = useSelector(
    (state) => state.conversation
  );

  const [selectedEmojiUnified, setSelectedEmojiUnified] =
    useState(unifiedEmojiBtn);

  useEffect(() => {
    setSelectedEmojiUnified(unifiedEmojiBtn);
  }, [unifiedEmojiBtn]);
  const [selectedEmoji, setSelectedEmoji] = useState("");

  function handleEmojiClick(emoji) {
    console.log(emoji);
    setSelectedEmojiUnified(emoji.unified);
    setSelectedEmoji(emoji.emoji);
  }

  function handleConfirm() {
    console.log("change emoji confirmed!");
    dispatch(setUnifiedEmojiBtn(selectedEmojiUnified));
    dispatch(setDisplayChangeEmojiOverlay(false));

    socket.emit("update conversation", {
      conversationId: activeConvo,
      message: `${user.username} set the emoji to ${selectedEmoji}.`,
      member: user._id,
      action: "change_emoji",
      data: {
        unifiedEmoji: selectedEmojiUnified,
        latestMessage: `${user.username} set the emoji to ${selectedEmoji}.`,
      },
    });
  }
  return (
    <div
      className={`${
        displayChangeEmojiOverlay ? "block" : "hidden"
      } absolute w-full h-full z-20 bg-black/70 justify-center items-center flex-col flex
              }`}
    >
      <div className={`bg-white rounded-md p-3`}>
        <div className="flex justify-end mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            className="w-10 h-8 cursor-pointer hover:fill-gray-500 mt-auto"
            onClick={(e) => {
              dispatch(setDisplayChangeEmojiOverlay(false));
            }}
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" />
          </svg>
        </div>
        <div className="flex justify-between mb-3">
          <div className="flex gap-2 items-center">
            <p className="font-semibold">Selected:</p>
            <Emoji unified={selectedEmojiUnified} size="35" />
          </div>
          <button className="bg-gray-600 text-white p-2 rounded-md">
            Set to Default
          </button>
        </div>
        <EmojiPicker onEmojiClick={handleEmojiClick} open={true} />

        <div className="flex justify-end mt-3">
          <button
            className="bg-blue-400 p-3 rounded-md cursor-pointer"
            onClick={(e) => {
              handleConfirm();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
