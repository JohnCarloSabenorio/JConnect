export default function ReactionsOverlay() {
  return (
    <div
      className={`absolute w-full h-full z-20 bg-black/70 justify-center items-center flex-col flex
        }`}
    >
      <div className="bg-white p-2 rounded-md">
        <h1 className="text-3xl">Reactions</h1>

        {/* List of reactions */}
        <div></div>

        {/* List of members for each reaction */}
        <div></div>
      </div>
    </div>
  );
}
