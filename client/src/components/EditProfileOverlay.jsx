import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDisplaySettingsOverlay } from "../redux/settingsOverlay";
import { changePassword } from "../api/user";
export default function EditProfileOverlay() {
  return (
    // The background
    <div
      className={`hidden absolute w-full h-full z-20 bg-black/70 justify-center items-center flex-col
        }`}
    >
      {/* The card */}
      <div className="bg-white rounded-md w-5xl h-150 flex flex-col overflow-hidden">
        {/* Settings Body */}
        <div className="flex grow">
          {/* Settings option */}

          {/* Settings content */}
          <div className="p-3 w-120">
            <h1 className="text-4xl font-bold mt-3">Profile</h1>
            {/* User Profile Form */}

            {/* Account Form */}
            <div className="mt-5 flex flex-col gap-5 w-full">
              <div className="w-full">
                <label htmlFor="email" className="font-semibold text-md">
                  Email
                </label>
                <input
                  type="email"
                  className="rounded-md grow px-3 py-2 block bg-gray-200 w-full"
                  value="user@example.com"
                  disabled={true}
                />
              </div>

              <div className="w-full">{/* Confirm New Password */}</div>
            </div>
            {/* Notifications Form */}
          </div>
          <div className="bg-[url(/img/backgrounds/settings-bg.jpg)] relative px-10 bg-fit bg-no-repeat flex-1 flex items-center justify-center">
            {/* Exit Button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="w-10 h-12 cursor-pointer absolute top-3 right-3 fill-white hover:fill-gray-500 mt-auto"
              onClick={(e) => {
                // Exit Edit Profile Overlay
              }}
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
