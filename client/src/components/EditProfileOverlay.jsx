import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDisplaySettingsOverlay } from "../redux/settingsOverlay";
import { changePassword } from "../api/user";
import { setEditDisplayProfileOverlay } from "../redux/editProfileOverlay";
export default function EditProfileOverlay() {
  const dispatch = useDispatch();
  const { displayEditProfileOverlay } = useSelector(
    (state) => state.editProfileOverlay
  );
  return (
    // The background
    <div
      className={`${
        displayEditProfileOverlay ? "flex" : "hidden"
      } absolute w-full h-full z-20 bg-black/70 justify-center items-center flex-col
        }`}
    >
      {/* The card */}
      <div className="bg-white rounded-md w-xl h-150 flex flex-col overflow-hidden relative p-5 pt-1">
        <h1 className="text-4xl font-bold mt-3">Profile</h1>

        {/* Profile Div */}
        <div className="rounded-md overflow-hidden shadow-md mt-3">
          <div className="w-full h-60 bg-red-400"></div>

          <div className="bg-white flex p-3">
            <div className="w-40 relative ml-0">
              <div className="bg-pink-400 absolute rounded-full bottom-1">
                <img src="/img/avatar.png" className="w-35" alt="profile-img" />
              </div>
            </div>

            <div className="text-xl text-center">
              <p>Username</p>
            </div>
          </div>
          <div className="mt-5 text-align-center p-5 min-h-50 m-5">
            <h3 className="font-bold">About Me</h3>
            <p className="p-3 min-h-30 text-gray-700 bg-gray-100 rounded-md">
              Bio goes here
            </p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          className="w-10 h-12 cursor-pointer absolute top-3 right-3 fill-black hover:fill-gray-500 mt-auto"
          onClick={(e) => {
            dispatch(setEditDisplayProfileOverlay(false));
            // Exit Edit Profile Overlay
          }}
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" />
        </svg>
      </div>
    </div>
  );
}
