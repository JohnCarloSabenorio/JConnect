import { logout } from "../api/authenticate";

export default function Navbar() {
  async function handleLogout() {
    try {
      await logout();
      // socket.disconnect();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="bg-gray-400 shadow-md flex justify-between p-5">
      <div className="">
        <h1 className="pb-2 text-4xl text-gray-800 font-bold">JConnect</h1>
      </div>

      <div className="flex gap-5 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width="30"
          height="30"
          fill="black"
        >
          <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
        </svg>
        <button>Toggle</button>

        <button
          className="group relative border-gray-300 cursor-pointer"
          type="button"
        >
          <img
            src="/img/icons/male-default.jpg"
            className="rounded-full w-12 h-12"
          />

          <div className="absolute top-full right-0 rounded-lg p-3 bg-gray-50  shadow-lg scale-y-0 group-focus:scale-y-100 origin-top duration-100 flex flex-col">
            <a className="active">Profile</a>
            <a>Settings</a>
            <a onClick={handleLogout}>Logout</a>
          </div>
        </button>
      </div>
    </div>
  );
}
