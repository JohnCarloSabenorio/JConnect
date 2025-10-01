import { setDisplayBlockOverlay, setIsHidden } from "../redux/overlay";
import { useDispatch, useSelector } from "react-redux";
import {
  archiveConversation,
  unarchiveConversation,
} from "../api/conversation";
import {
  filterArchivedConvo,
  filterRestoredConvo,
  setActiveConvoIsArchived,
  setConversationStatus,
} from "../redux/conversation";

import { blockConversation } from "../api/conversation";
import { unblockConversation } from "../api/conversation";
import { setConvoViewMode, updateSidebar } from "../redux/sidebar";
export default function BlockOverlay() {
  const {
    activeConvo,
    activeConvoIsArchived,
    activeConvoIsGroup,
    allDirectConversation,
  } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  const { displayBlockOverlay } = useSelector((state) => state.overlay);

  // Archive the user conversation record of the current user
  function blockConvo(convoId) {
    dispatch(setDisplayBlockOverlay(false));
  }

  // Unarchive the user conversation record of the current user
  function unblockConvo(convoId) {
    dispatch(setDisplayBlockOverlay(false));
  }

  console.log("the fucking active convo:", activeConvo);

  return (
    <>
      <div
        className={`${
          displayBlockOverlay ? "flex" : "hidden"
        } absolute w-full h-full z-20 bg-black/70  justify-center items-center flex-col `}
      >
        <div className="bg-white rounded-md p-5">
          <p>Are you certain you want to block this conversation?</p>
          <div className="flex justify-center gap-2 mt-5">
            <button
              onClick={() => blockConvo(activeConvo)}
              className="bg-blue-500 rounded-md p-1 px-4 text-white cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={() => unblockConvo(activeConvo)}
              className="bg-red-500 rounded-md p-1 px-4 text-white cursor-pointer"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
