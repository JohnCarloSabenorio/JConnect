import { acceptFriendRequest, rejectFriendRequest } from "../api/friends";
import { useState } from "react";
import { setDisplayedUser } from "../redux/profile_overlay";
import { showProfileOverlay } from "../redux/profile_overlay";
import { useDispatch } from "react-redux";
export default function NotificationCard({ data }) {
  const [requestAccepted, setRequestAccepted] = useState(false);
  const dispatch = useDispatch();
  console.log("notification data:", data);

  async function acceptRequest(actor_id) {
    const response = await acceptFriendRequest(actor_id);

    if (!response) {
      alert("This request is no longer available!");
    }
  }

  async function rejectRequest(actor_id) {
    const response = await rejectFriendRequest(actor_id);

    if (!response) {
      alert("This request is no longer available!");
    }
  }

  return (
    <>
      <div
        className="p-3 text-left gap-5 flex justify-between hover:bg-blue-500 cursor-pointer hover:text-white align-middle"
        onClick={(e) => {
          if (data.notification_type == "fr_received") {
            dispatch(setDisplayedUser(data.actor));
            dispatch(showProfileOverlay());
          }
        }}
      >
        <img src="img/avatar.png" className="w-10 h-10"></img>
        <div className="w-full">
          <p>{data.message}</p>
        </div>

        <div className="align-middle flex flex-col justify-center">
          {!data.seen && (
            <div className="rounded-full w-3 h-3 bg-blue-400 mb-4"></div>
          )}
        </div>
      </div>
    </>
  );
}
