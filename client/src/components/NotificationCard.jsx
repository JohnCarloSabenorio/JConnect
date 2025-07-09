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

  return (
    <>
      <div className="p-3 text-left gap-5 flex justify-between hover:bg-blue-500 hover:text-white align-middle">
        <img src="img/avatar.png" className="w-10 h-10"></img>
        <div className="w-full">
          <p>{data.message}</p>
        </div>

        {/* Accept or Reject Friend Request */}

        {data.notification_type[0] == "fr_received" && (
          <div className="flex gap-5 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="bg-green-400 w-8 h-8 rounded-full p-1 cursor-pointer fill-white"
              onClick={() => {
                acceptRequest(data.actor_id);
              }}
            >
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="bg-red-400 w-8 h-8 rounded-full p-1 cursor-pointer fill-white"
              onClick={() => {
                rejectRequest(data.actor_id);
              }}
            >
              <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z" />
            </svg>
          </div>
        )}

        <div className="align-middle flex flex-col justify-center">
          {!data.seen && (
            <div className="rounded-full w-3 h-3 bg-blue-400 mb-4"></div>
          )}
        </div>
      </div>
    </>
  );
}
