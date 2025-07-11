import { acceptFriendRequest, rejectFriendRequest } from "../api/friends";
import { useState } from "react";

export default function NotificationCard({ data }) {
  console.log("the notification data:", data);

  const [requestAccepted, setRequestAccepted] = useState(false);

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
  console.log("The data of the notif:", data);

  return (
    <>
      <div
        className="p-3 text-left gap-5 flex justify-between hover:bg-blue-500 cursor-pointer hover:text-white align-middle"
        onClick={(e) => {
          if (data.notification_type[0] == "fr_received") {
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
