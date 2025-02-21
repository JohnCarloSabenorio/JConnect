export default function Friend({ imageUrl }) {
  return (
    <>
      <div
        className="mt-5 flex flex-col gap-2"
        onClick={() => {
          eventHandler(convoId, name);
        }}
      >
        <div className="bg-white rounded-md flex p-5 shadow-md cursor-pointer">
          <img src={imageUrl} className="rounded-full w-12 h-12" />
          <div className="flex flex-grow">
            <div className="px-3 bg-blue-200 flex-grow">
              <p className="font-bold">Name of the friend</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
