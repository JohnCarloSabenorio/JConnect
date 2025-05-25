export default function UnfriendOverlay() {
  return (
    <>
      <div
        className={`absolute w-full h-full z-20 bg-black/70  justify-center items-center flex-col flex
        }`}
      >
        <div className="bg-white p-5">
          <p>Are you sure you want to unfriend this {"user?"}</p>
          <div>
            <button>Yes</button>
            <button>No</button>
          </div>
        </div>
      </div>
    </>
  );
}
