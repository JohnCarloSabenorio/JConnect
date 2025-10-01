import { setIsHidden } from "../redux/overlay";
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

import { setConvoViewMode, updateSidebar } from "../redux/sidebar";
export default function OverlayModal() {
  const {
    activeConvo,
    activeConvoIsArchived,
    activeConvoIsGroup,
    allDirectConversation,
  } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  // Archive the user conversation record of the current user
  function blockConvo(convoId) {}

  // Unarchive the user conversation record of the current user
  function unblockConvo(convoId) {}

  console.log("the fucking active convo:", activeConvo);

  return (
    <>
      <div className="bg-white rounded-md p-5">
        <p>Are you certain you want to block this conversation?</p>
        <div className="flex justify-center gap-2 mt-5">
          <button
            onClick={() => {
              if (activeConvoIsArchived) {
                unblockConvo(activeConvo);
              } else {
                blockConvo(activeConvo);
              }
              dispatch(setIsHidden());
            }}
            className="bg-blue-500 rounded-md p-1 px-4 text-white cursor-pointer"
          >
            Yes
          </button>
          <button
            onClick={() => dispatch(setIsHidden())}
            className="bg-red-500 rounded-md p-1 px-4 text-white cursor-pointer"
          >
            No
          </button>
        </div>
      </div>
    </>
  );
}
