import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDisplaySettingsOverlay } from "../redux/settingsOverlay";
import { setEditDisplayProfileOverlay } from "../redux/editProfileOverlay";
import { updateCurrentUser } from "../api/user";
import { UserContext } from "../App";
export default function EditProfileOverlay() {
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const { displayEditProfileOverlay } = useSelector(
    (state) => state.editProfileOverlay
  );

  async function updateMyUsername(data) {
    const newData = await updateCurrentUser({ username: username });
    user.username = username;
    setEditUsername(false);
  }

  async function updateMyBio(data) {
    const newData = await updateCurrentUser({ bio: bio });
    user.bio = bio;
    setDisableBio(true);
  }

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [disableBio, setDisableBio] = useState(true);
  const [editUsername, setEditUsername] = useState(false);

  useEffect(() => {
    setBio(user.bio);
    setUsername(user.username);
  }, [user]);

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

            <div className="text-xl text-center flex items-center gap-2">
              {editUsername ? (
                <input
                  placeholder=""
                  className="shadow-md max-w-50 rounded-md"
                  onInput={(e) => {
                    setUsername(e.target.value);
                    console.log("the username:", username);
                  }}
                />
              ) : (
                <p>{user.username}</p>
              )}
              {editUsername ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="fill-black w-7 h-7 cursor-pointer hover:fill-gray-400"
                  onClick={(e) => {
                    updateMyUsername();
                  }}
                >
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="fill-black w-7 h-7 cursor-pointer hover:fill-gray-400"
                  onClick={(e) => setEditUsername(true)}
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
                </svg>
              )}
            </div>
          </div>
          <div className=" text-align-center px-5 min-h-50">
            <h3 className="font-bold">About Me</h3>

            {disableBio ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="fill-black w-7 h-7 cursor-pointer hover:fill-gray-400"
                onClick={(e) => setDisableBio(false)}
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="fill-black w-7 h-7 cursor-pointer hover:fill-gray-400"
                onClick={(e) => {
                  updateMyBio({ bio: bio });
                }}
              >
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
              </svg>
            )}
            <textarea
              className="p-3 min-h-30 w-full resize-none text-gray-700 bg-gray-100 rounded-md"
              disabled={disableBio}
              onChange={(e) => {
                setBio(e.target.value);
              }}
              value={bio}
            />
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
