import { findConvoWithUser, convoIsArchived } from "../api/conversation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { updateSidebar, changeActiveInbox } from "../redux/sidebar";
import { UserContext } from "../App";
import { useContext } from "react";
import {
  setActiveConvoIsGroup,
  setActiveDirectUser,
  setUserIsFriend,
} from "../redux/conversation";
export default function Friend({
  friendId,
  name,
  imageUrl,
  friendClickHandler,
}) {
  const { sidebarSearch } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  return (
    <>
      <div
        className={`mt-5 flex flex-col gap-2 ${
          name.toLowerCase().includes(sidebarSearch.toLowerCase())
            ? "visible"
            : "hidden"
        }`}
        onClick={async () => {
          // This will get the conversation id from chatAFriend from chat.jsx
          // const convoId = await friendClickHandler(friendId);
          // const isArchived = await convoIsArchived(convoId);
          // console.log("IS THE CONVERSATION ARCHIVED?", isArchived);
          // dispatch(setActiveConvoIsGroup(false));
          // dispatch(changeActiveInbox("direct"));
          // dispatch(setActiveDirectUser(friendId));
          // dispatch(setUserIsFriend(true));
          // // This may be refactored after other statuses are implemented (blocked, deleted, etc...)
          // dispatch(
          //   updateSidebar({
          //     sidebarTitle: isArchived ? "archived" : "inbox",
          //     sidebarContent: isArchived ? "Archived" : "directs",
          //     sidebarBtn: isArchived ? "archived-btn" : "inbox-btn",
          //   })
          // );
        }}
      >
        <div className="bg-white rounded-md flex p-5 shadow-md cursor-pointer">
          <img src={imageUrl} className="rounded-full w-12 h-12" />
          <div className="flex flex-grow">
            <div className="px-3  flex-grow">
              <p className="font-bold">{name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
