import { chatWithFriend } from "../api/conversation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  updateSidebar,
  changeSidebarTitle,
  changeSidebarContent,
  changeSidebarBtn,
  changeActiveInbox,
} from "../redux/sidebar";
export default function Friend({
  friendId,
  name,
  imageUrl,
  friendClickHandler,
  currentActiveId,
  setCurrentActiveId,
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
          const convoId = await friendClickHandler(friendId);

          dispatch(changeActiveInbox("direct"));
          dispatch(
            updateSidebar({
              sidebarTitle: "inbox",
              sidebarContent: "directs",
              sidebarBtn: "inbox-btn",
            })
          );

          setCurrentActiveId(convoId);
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
