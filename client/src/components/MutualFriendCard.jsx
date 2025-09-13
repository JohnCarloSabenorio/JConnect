import { setDisplayedUser, showProfileOverlay } from "../redux/profileOverlay";
import { useDispatch } from "react-redux";
export default function MutualFriendCard({ userData }) {
  const dispatch = useDispatch();
  const openProfile = () => {
    dispatch(showProfileOverlay());
    dispatch(setDisplayedUser(userData));
  };
  return (
    <div
      className="flex gap-3 items-center bg-gray-100 p-3 shadow-md cursor-pointer rounded-md"
      onClick={(e) => {
        openProfile();
      }}
    >
      <img src="/img/avatar.png" className="w-12" alt="profile-img" />
      <p>{userData.username}</p>
    </div>
  );
}
