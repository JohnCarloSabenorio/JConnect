import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { setDisplayedUser } from "../redux/profile_overlay";

import { showProfileOverlay } from "../redux/profile_overlay";

export default function UserCard({ userId, name, imageUrl, chatAFriend }) {
  const { allUsers } = useSelector((state) => state.user);
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
          dispatch(showProfileOverlay());
          dispatch(
            setDisplayedUser(allUsers.find((user) => user._id === userId))
          );
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
