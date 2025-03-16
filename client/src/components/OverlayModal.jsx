import { setIsHidden } from "../redux/overlay";
import { useDispatch, useSelector } from "react-redux";
import {
  archiveConversation,
  unarchiveConversation,
} from "../api/conversation";
import {
  filterArchivedConvo,
  filterRestoredConvo,
} from "../redux/conversation";

export default function OverlayModal() {
  const { activeConvo, activeConvoIsArchived } = useSelector(
    (state) => state.conversation
  );
  const dispatch = useDispatch();

  function archiveConvo(convoId) {
    dispatch(filterArchivedConvo(convoId));
    archiveConversation(convoId);
  }

  function unarchiveConvo(convoId) {
    dispatch(filterRestoredConvo(convoId));
    unarchiveConversation(convoId);
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
