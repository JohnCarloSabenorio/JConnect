import { chatWithFriend } from "../api/conversation";
export default function Friend({
  friendId,
  name,
  imageUrl,
  friendClickHandler,
  changeSidebarContent,
  currentActiveId,
  setCurrentActiveId,
  setActiveBtn,
  searchInput,
}) {
  return (
    <>
      <div
        className={`mt-5 flex flex-col gap-2 ${
          name.toLowerCase().includes(searchInput) ? "visible" : "hidden"
        }`}
        onClick={async () => {
          // This will get the conversation id from chatAFriend from chat.jsx
          const convoId = await friendClickHandler(friendId);
          changeSidebarContent("Directs");
          setActiveBtn("inbox-btn");
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
