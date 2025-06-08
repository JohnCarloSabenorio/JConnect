import { useState, useEffect } from "react";
import { logout } from "../api/authenticate";
import NotificationCard from "./NotificationCard";
import { getAllNotifications } from "../api/notification";
import { useSelector, useDispatch } from "react-redux";
import { setAllNotifications } from "../redux/notification";
export default function Navbar() {
  const [menuActive, setMenuActive] = useState(false);
  const [notifActive, setNotifActive] = useState(false);
  const { allNotifications } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    getNotifications();
  }, []);

  async function getNotifications() {
    const notifications = await getAllNotifications();
    dispatch(setAllNotifications(notifications));
  }

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
    <div className="bg-blue-800 flex justify-between p-2">
      <div className="flex items-center">
        <h1 className="align-middle text-3xl text-gray-50 font-bold">
          JConnect
        </h1>
      </div>

      <div className="flex gap-4 items-center mr-2 z-10">
        {/* Notification button */}
        <button
          className="relative cursor-pointer"
          onClick={(e) => {
            setNotifActive((prev) => !prev);
            setMenuActive(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="30"
            height="30"
            fill="white"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
          </svg>
          {/* Number of notifications */}
          <p className="w-5 h-5 absolute rounded-full bg-red-500 flex items-center justify-center text-xs text-white bottom-4 left-4">
            3
          </p>
          <div
            className={`${
              notifActive ? "flex" : "hidden"
            } absolute top-full mt-5 right-0 max-h-200 w-100 pb-2 bg-gray-50 shadow-lg origin-top duration-100 flex-col overflow-hidden overflow-y-scroll rounded-sm`}
          >
            <h1 className="font-bold text-4xl text-left ml-4 mb-3 mt-3">
              Notifications
            </h1>

            {allNotifications.length > 0 ? (
              allNotifications.map((data, id) => {
                return <NotificationCard key={id} ref={data._id} data={data} />;
              })
            ) : (
              <>
                <p>You currently have no notifications.</p>
              </>
            )}
          </div>
        </button>

        <button
          className="group relative border-gray-300 cursor-pointer"
          type="button"
          onClick={(e) => {
            setMenuActive((prev) => !prev);
            setNotifActive(false);
          }}
        >
          <img
            src="/img/icons/male-default.jpg"
            className="rounded-full w-12 h-12"
          />

          <div
            className={`${
              menuActive ? "flex" : "hidden"
            } absolute top-full mt-3 right-0 rounded-sm w-50 bg-gray-50 shadow-lg origin-top duration-100 flex-col justify-start`}
          >
            <a className="hover:bg-blue-200 rounded-sm p-2">Profile</a>
            <a className="hover:bg-blue-200 rounded-sm p-2">Settings</a>
            <a
              onClick={handleLogout}
              className="hover:bg-blue-200 rounded-sm p-2"
            >
              Logout
            </a>
          </div>
        </button>
      </div>
    </div>
  );
}
