export default function ProfileOverlay() {
  return (
    <div className="absolute w-full h-full z-20 bg-black/70 flex justify-center items-center flex-col">
      {/* Close Button */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="#e3e3e3"
        className="absolute top-5 right-5 w-10 h-10 cursor-pointer"
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>

      {/* Profile Modal */}
      <div className="bg-white max-w-2xl rounded-md overflow-hidden  p-5">
        <div className="bg-white flex">
          <div>
            <img src="/img/avatar.png" className="" alt="profile-img"></img>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            <label className="font-bold" for="user-name">
              Name
            </label>
            <h1 id="user-name" className="break-words whitespace-normal">
              John Doe
            </h1>
            <label className="font-bold" for="user-email">
              Email
            </label>
            <p className="break-words whitespace-normal">
              johncarlosabenorio07@gmail.com
            </p>
            <label className="font-bold" for="user-number">
              Phone Number
            </label>
            <p id="user-number" className="break-words whitespace-normal">
              09123456578
            </p>

            <label className="font-bold" for="user-location">
              Location
            </label>
            <p id="user-location" className="break-words whitespace-normal">
              Imus, Cavite
            </p>
            <label className="font-bold" for="user-status">
              Online Status
            </label>
            <p id="user-status" className="break-words whitespace-normal">
              Online
            </p>
          </div>
        </div>
        <div className="bg-white flex">
          <div className="mt-5">
            <h1 className="font-bold">Bio</h1>
            <p className="text-pretty">
              Web developer with a passion for building interactive
              applications. Specializing in JavaScript, React, and Node.js.
              Always looking for ways to improve user experience and write
              clean, scalable code. Currently learning AI and exploring new
              technologies!
            </p>
          </div>

          {/* <div className="mt-5">
            <div>
              <h1 className="font-bold">Skills</h1>
            </div>
            <div>
              <h1 className="font-bold">Interests</h1>
            </div>
          </div> */}
        </div>

        <div className="mt-5 text-align-center">
          <button className="bg-blue-300 text-white font-bold rounded-sm px-3 py-2">Chat Now!</button>
        </div>
      </div>
    </div>
  );
}
