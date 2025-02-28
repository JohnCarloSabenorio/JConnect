import { useState, useEffect } from "react";
export default function Convo({
  name,
  msg,
  msgCount,
  timeSent,
  imageUrl,
  convoId,
  isActive,
  eventHandler,
  changeCurrentActive,
  searchInput,
}) {
  const [bgColor, setBgColor] = useState("bg-white");

  useEffect(() => {
    setBgColor(isActive ? "bg-green-200" : "bg-white");
  }, [isActive]);
  const formatTime = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <>
      <div
        className={`mt-5 flex flex-col gap-2 ${
          name.toLowerCase().includes(searchInput) ? "visible" : "hidden"
        }`}
        onClick={() => {
          eventHandler(convoId, name);

          changeCurrentActive(convoId);
          setBgColor("bg-green-200");
        }}
      >
        <div
          className={`${bgColor} rounded-md flex p-5 shadow-md cursor-pointer`}
        >
          <img src={imageUrl} className="rounded-full w-12 h-12" />
          <div className="flex flex-grow">
            <div className="px-3  flex-grow">
              <p className="font-bold">{name}</p>
              <p>{msg.length > 10 ? msg.slice(0, 19) + "..." : msg}</p>
            </div>
            <div className="ml-auto">
              <p>{formatTime(timeSent)}</p>
              <p className="text-right font-bold">{msgCount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
