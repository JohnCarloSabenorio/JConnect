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
  updateAConvo,
  updateConvoStatus,
  updateConvoStatusGroup,
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
  async function blockConvo(convoId) {
    const response = await blockConversation(convoId);

    if (response.blockedConvo.isGroup) {
      dispatch(
        updateConvoStatusGroup([
          response.blockedConvo._id,
          response.blockedConvo.status,
        ])
      );
    } else {
      dispatch(
        updateConvoStatus([
          response.blockedConvo._id,
          response.blockedConvo.status,
        ])
      );
    }

    dispatch(setConversationStatus("blocked"));
    dispatch(setDisplayBlockOverlay(false));
  }

  // Unarchive the user conversation record of the current user
  async function unblockConvo(convoId) {
    const response = await unblockConversation(convoId);

    if (response.blockedConvo.isGroup) {
      dispatch(
        updateConvoStatusGroup([
          response.blockedConvo._id,
          response.blockedConvo.status,
        ])
      );
    } else {
      dispatch(
        updateConvoStatus([
          response.blockedConvo._id,
          ,
          response.blockedConvo.status,
        ])
      );
    }
    dispatch(setConversationStatus("active"));
    dispatch(setDisplayBlockOverlay(false));
  }

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
              onClick={() => dispatch(setDisplayBlockOverlay(false))}
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
