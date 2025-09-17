import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDisplaySettingsOverlay } from "../redux/settingsOverlay";
import { changePassword } from "../api/user";
export default function SettingsOverlay() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { displaySettingsOverlay } = useSelector(
    (state) => state.settingsOverlay
  );

  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const [errorMessages, setErrorMessages] = useState([]);

  async function submitChangePassword() {
    const response = await changePassword(
      currentPassword,
      newPassword,
      confirmNewPassword
    );

    if (response.status == 200) {
      resetPasswordInputs();
      setIsChangingPassword(false);
      setPasswordUpdated(true);
      setErrorMessages([]);
    } else {
      setErrorMessages(response.response.data.errorMessages);
      setPasswordUpdated(false);
      resetPasswordInputs();
    }
  }

  function resetPasswordInputs() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  }
  return (
    // The background
    <div
      className={`${
        displaySettingsOverlay ? "block" : "hidden"
      } absolute w-full h-full z-20 bg-black/70 justify-center items-center flex-col flex
        }`}
    >
      {/* The card */}
      <div className="bg-white rounded-md w-5xl h-150 flex flex-col overflow-hidden">
        {/* Settings Body */}
        <div className="flex grow">
          {/* Settings option */}

          {/* Settings content */}
          <div className="p-3 w-120">
            <h1 className="text-4xl font-bold mt-3">Account Settings</h1>
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

              <div className="w-full">
                {/* Current Password */}
                <div className={`${isChangingPassword ? "block" : "hidden"}`}>
                  <label htmlFor="password" className="font-semibold text-md">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className={`rounded-md grow px-3 py-2 block bg-gray-${
                      isChangingPassword ? "100" : "200"
                    } mb-3 w-full`}
                    disabled={!isChangingPassword}
                    value={currentPassword}
                    name="currentPassword"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                {/* New Password */}
                <div className={`${isChangingPassword ? "block" : "hidden"}`}>
                  <label htmlFor="newPassword" className="font-semibold">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="rounded-md grow px-3 py-2 block bg-gray-100 w-full"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                {/* Confirm New Password */}
                <div className={`${isChangingPassword ? "block" : "hidden"}`}>
                  <label htmlFor="password2" className="font-semibold">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="rounded-md grow px-3 py-2 block bg-gray-100 w-full"
                    name="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
                <button
                  onClick={(e) => setIsChangingPassword((prev) => !prev)}
                  className={`${
                    isChangingPassword ? "hidden" : "block"
                  } mt-3 bg-blue-200 px-5 py-2 cursor-pointer rounded-md hover:bg-blue-400 hover:text-white`}
                >
                  Change Password
                </button>

                <div
                  className={`${
                    isChangingPassword ? "block" : "hidden"
                  } flex gap-2`}
                >
                  <button
                    onClick={(e) => {
                      setErrorMessages([]);
                      resetPasswordInputs();
                      setIsChangingPassword(false);
                    }}
                    className="mt-3 bg-gray-100 px-5 py-2 cursor-pointer rounded-md hover:bg-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={(e) => {
                      submitChangePassword();
                    }}
                    className="mt-3 bg-blue-200 px-5 py-2 cursor-pointer rounded-md hover:bg-blue-400 hover:text-white"
                  >
                    Save Password
                  </button>
                </div>
              </div>
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
                dispatch(setDisplaySettingsOverlay(false));
                setPasswordUpdated(false);
              }}
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" />
            </svg>
            <div
              className={`${
                errorMessages.length > 0 ? "block" : "hidden"
              } bg-red-200 rounded-md p-6 w-full h-100 border-2 border-red-400`}
            >
              <ul>
                {errorMessages.map((err, i) => {
                  return (
                    <li className="list-disc mb-2" key={i}>
                      {err}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              className={`${
                passwordUpdated ? "block" : "hidden"
              } bg-gray-50 rounded-md p-6 w-full border-2 border-green-800`}
            >
              <h1 className="text-center font-bold text-green-800 font text-2xl">
                Password Updated Sucessfully!
              </h1>
              <img src="/images/cats-dancing.gif"></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
