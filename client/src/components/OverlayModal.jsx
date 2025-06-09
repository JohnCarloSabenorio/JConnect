import { setIsHidden } from "../redux/overlay";
import { useDispatch, useSelector } from "react-redux";
import {
  archiveConversation,
  unarchiveConversation,
} from "../api/conversation";
import {
  filterArchivedConvo,
  filterRestoredConvo,
  setActiveConversation,
  setActiveConvoIsArchived,
} from "../redux/conversation";

import { setConvoViewMode, updateSidebar } from "../redux/sidebar";

export default function OverlayModal() {
  const { activeConvo, activeConvoIsArchived, activeConvoIsGroup } =
    useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  // Archive the user conversation record of the current user
  function archiveConvo(convoId) {
    console.log("ARCHIVING CONVERSATION:", convoId);
    dispatch(filterArchivedConvo(convoId));
    dispatch(setActiveConvoIsArchived(true));
    archiveConversation(convoId);
    dispatch(setConvoViewMode(activeConvoIsGroup ? 1 : 0));

    dispatch(
      updateSidebar({
        sidebarTitle: "archived",
        sidebarContent: "archived",
        sidebarBtn: "archived-btn",
      })
    );
  }

  // Unarchive the user conversation record of the current user
  function unarchiveConvo(convoId) {
    dispatch(filterRestoredConvo(convoId));
    dispatch(setActiveConvoIsArchived(false));
    unarchiveConversation(convoId);
    dispatch(setConvoViewMode(activeConvoIsGroup ? 1 : 0));

    dispatch(
      updateSidebar({
        sidebarTitle: "inbox",
        sidebarContent: "inbox",
        sidebarBtn: "inbox-btn",
      })
    );

    // dispatch(changeActiveInbox("direct"));
    // dispatch(hideProfileOverlay());
  }

  return (
    <>
      <div className="bg-white rounded-md p-5">
        <p>
          {activeConvoIsArchived
            ? "Are you certain you want to restore this conversation from the archive?"
            : "Are you certain you want to move this conversation to the archive?"}
        </p>
        <div className="flex justify-center gap-2 mt-5">
          <button
            onClick={() => {
              if (activeConvoIsArchived) {
                unarchiveConvo(activeConvo);
              } else {
                archiveConvo(activeConvo);
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
