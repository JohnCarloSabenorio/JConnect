import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { setDisplayedUser } from "../redux/profileOverlay";

import { showProfileOverlay } from "../redux/profileOverlay";
import { getUser } from "../api/user";
export default function UserCard({ user, imageUrl }) {
  const { allUsers } = useSelector((state) => state.user);
  const { sidebarSearch, sidebarContent } = useSelector(
    (state) => state.sidebar
  );

  async function handleDisplayProfile() {
    const userData = await getUser(user._id);

    console.log("the userData:", userData);
    console.log("the user:", user);
    dispatch(showProfileOverlay());
    dispatch(setDisplayedUser(userData));
  }

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
          handleDisplayProfile();
        }}
      >
        <div className="bg-white hover:bg-gray-200 rounded-md flex p-5 shadow-md cursor-pointer">
          <div className="relative">
            <img
              src={user.profilePicture}
              className="rounded-full w-12 h-12 border-1"
            />
            <div
              className={`${
                sidebarContent == "friends" ? "block" : "hidden"
              } absolute right-0.5 border-1 bottom-0.5 ${
                user.status == "online" ? "bg-green-400" : "bg-gray-400"
              } w-4 h-4 rounded-full`}
            ></div>
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
