function Convo({
  name,
  msg,
  msgCount,
  timeSent,
  imageUrl,
  convoId,
  eventHandler,
}) {
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
        className="mt-5 flex flex-col gap-2"
        onClick={() => {
          eventHandler(convoId);
        }}
      >
        <div className="bg-white rounded-md flex p-5 shadow-md cursor-pointer">
          <img src={imageUrl} className="rounded-full w-12 h-12" />
          <div className="flex flex-grow">
            <div className="px-3 bg-blue-200 flex-grow">
              <p>{name}</p>
              <p>{msg}</p>
            </div>
            <div className="ml-auto bg-green-200">
              <p>{formatTime(timeSent)}</p>
              <p className="text-right font-bold">{msgCount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Convo;
