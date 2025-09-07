import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { setDisplayedUser } from "../redux/profileOverlay";

import { showProfileOverlay } from "../redux/profileOverlay";

export default function UserCard({ user, imageUrl }) {
  const { allUsers } = useSelector((state) => state.user);
  const { sidebarSearch } = useSelector((state) => state.sidebar);

  const dispatch = useDispatch();
  return (
    <>
      <div
        className={`mt-5 flex flex-col gap-2 ${
          user.username.toLowerCase().includes(sidebarSearch.toLowerCase())
            ? "visible"
            : "hidden"
        }`}
        onClick={async () => {
          dispatch(showProfileOverlay());
          dispatch(setDisplayedUser(user));
        }}
      >
        <div className="bg-white hover:bg-gray-200 rounded-md flex p-5 shadow-md cursor-pointer">
          <div className="relative">
            <img src={imageUrl} className="rounded-full w-12 h-12 border-1" />
            <div className="absolute right-0.5 border-1 bottom-0.5 bg-green-400 w-4 h-4 rounded-full"></div>
          </div>
          <div className="flex flex-grow">
            <div className="px-3  flex-grow">
              <p className="font-bold">{user.username}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
