export default function Chat({
  isCurrentUser,
  imgUrl,
  message,
  username,
  timeSent,
}) {
  function formatTime(timestamp) {
    const newDate = new Date(timestamp);
    const day = newDate.toLocaleDateString("en-US", { weekday: "long" });

    const time = newDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${day}: ${time}`;
  }

  return (
    <div className="flex flex-col p-5">
      <div className={`flex ${isCurrentUser ? "ml-auto mr-15" : "ml-15"}`}>
        <p>{username}</p>
      </div>
      <div className={isCurrentUser ? "ml-auto flex gap-2" : "flex gap-2"}>
        {isCurrentUser ? (
          <>
            <div className="relative group">
              <div className="max-w-max bg-blue-400 p-2 rounded-sm">
                <p className="break-all">{message}</p>
              </div>

              <span className="absolute left-0 bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {formatTime(timeSent)}
              </span>
            </div>
            <img
              src={imgUrl}
              className="rounded-full w-12 h-12"
              alt="User Image"
            />
          </>
        ) : (
          <>
            <img
              src={imgUrl}
              className="rounded-full w-12 h-12"
              alt="User Image"
            />

            <div className="relative group">
              <div className="max-w-max bg-green-400 p-2 rounded-sm">
                <p className="break-all">{message}</p>
              </div>

              <span className="absolute right-0 bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {formatTime(timeSent)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* 
              <div className="flex flex-col p-5">
                <div className="ml-auto flex gap-2">
                  <div className="max-w-max bg-blue-400 p-2 rounded-sm">
                    <p className="break-all">This is a sample user message!</p>
                  </div>
                  <img
                    src="/img/icons/male-default.jpg"
                    className="rounded-full w-12 h-12"
                  />
                </div>
              </div>
*/
