import { useEffect, useState, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDisplaySettingsOverlay } from "../redux/settingsOverlay";
import { setEditDisplayProfileOverlay } from "../redux/editProfileOverlay";
import { updateCurrentUser } from "../api/user";
import { UserContext } from "../App";
export default function EditProfileOverlay() {
  const { user, setUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const { displayEditProfileOverlay } = useSelector(
    (state) => state.editProfileOverlay
  );

  useEffect(() => {
    console.log("the user:", user);
  }, [user]);
  const profilePictureRef = useRef();
  const profileBannerRef = useRef();
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
  async function updateMyProfilePicture() {
    const formData = new FormData();

    formData.append("profilePicture", newProfilePictureFile);
    const newData = await updateCurrentUser(formData);

    setUser((prev) => ({
      ...prev,
      profilePicture: newData.profilePicture,
      profilePictureUrl: newData.profilePictureUrl,
    }));
    setProfilePreviewUrl("");
    setnewProfilePictureFile(null);
    setIsUpdatingImage(false);
  }
  async function updateMyProfileBanner() {
    const formData = new FormData();
    formData.append("profileBanner", newProfileBannerFile);
    const newData = await updateCurrentUser(formData);
    setUser((prev) => ({
      ...prev,
      profileBanner: newData.profileBanner,
      profileBannerUrl: newData.profileBannerUrl,
    }));
    setBannerPreviewUrl("");
    setNewProfileBannerFile(null);
    setIsUpdatingImage(false);
  }

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [disableBio, setDisableBio] = useState(true);
  const [editUsername, setEditUsername] = useState(false);

  const [bannerPreviewUrl, setBannerPreviewUrl] = useState("");
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");

  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [profileBannerUrl, setProfileBannerUrl] = useState("");

  const [newProfilePictureFile, setnewProfilePictureFile] = useState(null);
  const [newProfileBannerFile, setNewProfileBannerFile] = useState(null);

  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [imageToUpdate, setImageToUpdate] = useState(0);
  useEffect(() => {
    setBio(user.bio);
    setUsername(user.username);
    setProfilePictureUrl(user.profilePictureUrl);
    setProfileBannerUrl(user.profileBannerUrl);
  }, [user]);

  function handleProfilePictureClick(data) {
    profilePictureRef.current.click();
  }
  function handleProfileBannerClick(data) {
    profileBannerRef.current.click();
  }

  function handleProfileImageChange(file) {
    // Check if the file exists
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setProfilePreviewUrl(imageURL);
    setnewProfilePictureFile(file);
    setIsUpdatingImage(true);
    setImageToUpdate(0);
  }

  function handleProfileBannerChange(file) {
    // Check if the file exists
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setBannerPreviewUrl(imageURL);
    setNewProfileBannerFile(file);
    setIsUpdatingImage(true);
    setImageToUpdate(1);
  }

  function cancelProfilePicture() {
    profilePictureRef.current.value = "";
    setProfilePreviewUrl("");
    setNewProfileBannerFile(null);
    setIsUpdatingImage(false);
  }
  function cancelProfileBanner() {
    profileBannerRef.current.value = "";
    setBannerPreviewUrl("");
    setNewProfileBannerFile(null);
    setIsUpdatingImage(false);
  }

  return (
    // The background
    <div
      className={`${
        displayEditProfileOverlay ? "flex" : "hidden"
      } absolute w-full h-full z-20 bg-black/70 justify-center items-center flex-col
        }`}
    >
      {/* The card */}
      <div className="bg-white rounded-md w-xl flex flex-col overflow-hidden relative p-5 pt-1">
        <h1 className="text-4xl font-bold mt-3">Profile</h1>

        {/* Profile Div */}
        <div className="rounded-md overflow-hidden shadow-md mt-3">
          {/* USE BANNER URL INSTEAD */}
          <div className={`w-full h-40 bg-cover bg-center relative`}>
            <img
              className="w-full h-full absolute"
              crossOrigin="anonymous"
              src={bannerPreviewUrl != "" ? bannerPreviewUrl : profileBannerUrl}
            />
            <input
              type="file"
              id="profile-banner"
              name="profile-banner"
              accept="image/png, image/jpeg"
              className="hidden"
              ref={profileBannerRef}
              onChange={(e) => handleProfileBannerChange(e.target.files[0])}
              disabled={profilePreviewUrl != ""}
            />

            {bannerPreviewUrl == "" && (
              <div
                className="w-full h-full absolute bg-gray-500/60 opacity-0 hover:opacity-80 flex items-center justify-center cursor-pointer"
                onClick={(e) => handleProfileBannerClick()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  className="fill-white w-9 h-9"
                >
                  <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                </svg>
              </div>
            )}
          </div>

          <div className="shadow-sm rounded-b-md flex p-3">
            <div className="w-40 relative ml-0">
              {/* Profile Picture */}
              <div className=" absolute w-30 h-30 rounded-full bottom-1 overflow-hidden">
                {/* Hover Upload  */}

                <input
                  type="file"
                  id="profile-picture"
                  name="profile-picture"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  ref={profilePictureRef}
                  onChange={(e) => handleProfileImageChange(e.target.files[0])}
                  disabled={bannerPreviewUrl != ""}
                />

                {profilePreviewUrl == "" && (
                  <div
                    className="w-full h-full absolute rounded-full bg-gray-500/60 opacity-0 hover:opacity-80 flex items-center justify-center cursor-pointer"
                    onClick={(e) => handleProfilePictureClick()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      className="fill-white w-9 h-9"
                    >
                      <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                    </svg>
                  </div>
                )}

                {profilePictureUrl != "" && (
                  <img
                    crossOrigin="anonymous"
                    src={
                      profilePreviewUrl != ""
                        ? profilePreviewUrl
                        : profilePictureUrl
                    }
                    className="bg-white rounded-full border-1"
                    alt="profile-img"
                  />
                )}
              </div>
            </div>

            <div className="text-xl text-center flex items-center gap-2">
              {editUsername ? (
                <input
                  placeholder=""
                  className="shadow-md max-w-50 rounded-md"
                  onInput={(e) => {
                    setUsername(e.target.value);
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
          <div className={`mt-5 ${isUpdatingImage ? "block" : "hidden"}`}>
            <p className="text-center font-semibold">
              {imageToUpdate == 0
                ? "Update your profile picture?"
                : "Update your profile banner?"}
            </p>
            <div className="flex justify-center gap-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="bg-green-400 fill-white w-7 h-7 cursor-pointer rounded-full"
                onClick={(e) => {
                  if (imageToUpdate == 0) {
                    updateMyProfilePicture();
                  } else {
                    updateMyProfileBanner();
                  }
                }}
              >
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="bg-red-400 fill-white w-7 h-7 cursor-pointer rounded-full"
                onClick={(e) => {
                  if (imageToUpdate == 0) {
                    cancelProfilePicture();
                  } else {
                    cancelProfileBanner();
                  }
                }}
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </div>
          </div>

          <div className=" text-align-center px-5 min-h-50">
            <div className="flex my-2 gap-1 items-center">
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
            </div>

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
