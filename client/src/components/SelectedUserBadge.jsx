import { removeSelectedUser } from "../redux/addMemberOverlay";
import { useDispatch } from "react-redux";
export default function SelectedUserBadge({ user }) {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col justify-center gap-1 relative">
      <div className="w-5 h-5 bg-gray-700 rounded-full absolute right-0 top-0 flex flex-col justify-center items-center">
        {" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="#e3e3e3"
          className={`top-5 right-5 w-4 h-4 cursor-pointer`}
          onClick={(e) => {
            dispatch(removeSelectedUser(user._id));
          }}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>
      <div className="w-20 h-20 border-1 p-2 rounded-full">
        <img src={user.profilePictureUrl} />
      </div>
      <p className="text-center">{user.username}</p>
    </div>
  );
}
