import { useState } from "react";
import { useSelector } from "react-redux";
export default function MediaPanel() {
  const { currentConvoName, activeConvoIsGroup, userIsFriend } = useSelector(
    (state) => state.conversation
  );
  const { mediaImages } = useSelector((state) => state.media);

  const [imagesActive, setImagesActive] = useState(false);
  const [filesActive, setFilesActive] = useState(false);
  const [customizeActive, setCustomizeActive] = useState(false);
  const [chatInfoActive, setChatinfoActive] = useState(false);
  const [membersActive, setMembersActive] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isGroup, setIsGroup] = useState(false);

  // console.log("THE MEDIA IMAGES:", mediaImages);

  return (
    <div className="border-0.5 w-100 h-full overflow-y-scroll">
      <div className="flex flex-col items-center justify-center p-10 pb-5">
        <img
          src="/img/icons/male-default.jpg"
          className="rounded-full w-30 h-30"
        />
        <p className="font-bold text-lg">{currentConvoName}</p>
        <p className="text-gray-500 text-center text-sm italic">
          I am a bastard that likes to play games!
        </p>
        {/* <p className="text-gray-500">johndoe@gmail.com</p> */}
        {/* Media Panel Buttons */}
        <div className="flex justify-center gap-3 mt-5">
          {/* Notifications Button */}
          <button
            onClick={(e) => setIsMuted((prev) => !prev)}
            className="cursor-pointer shadow-lg p-2 text-sm flex justify-center items-center rounded-full"
          >
            {isMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                width="25"
                height="25"
                fill="black"
              >
                <path d="M160-200v-80h80v-280q0-33 8.5-65t25.5-61l60 60q-7 16-10.5 32.5T320-560v280h248L56-792l56-56 736 736-56 56-146-144H160Zm560-154-80-80v-126q0-66-47-113t-113-47q-26 0-50 8t-44 24l-58-58q20-16 43-28t49-18v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v206Zm-276-50Zm36 324q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm33-481Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                width="25"
                height="25"
                fill="black"
              >
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
            )}
          </button>

          {/* Block button */}
          <button
            className={`${
              activeConvoIsGroup ? "hidden" : "block"
            } cursor-pointer shadow-lg p-2 text-sm flex justify-center items-center rounded-full`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              width="25"
              height="25"
              fill="black"
            >
              <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z" />
            </svg>
          </button>

          {/* Archive Button */}
          <button className="cursor-pointer shadow-lg p-2 text-sm flex justify-center items-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              width="25"
              height="25"
              fill="black"
            >
              <path d="m480-240 160-160-56-56-64 64v-168h-80v168l-64-64-56 56 160 160ZM200-640v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button className="cursor-pointer shadow-lg p-2 text-sm flex justify-center items-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              width="25"
              height="25"
              fill="black"
            >
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
            </svg>
          </button>

          {/* Unfriend button */}
          <button
            // onClick={(e) => setIsFriend((prev) => !prev)}
            className={`cursor-pointer shadow-md p-2 text-sm ${
              userIsFriend ? "bg-red-400" : "bg-blue-400"
            } ${
              activeConvoIsGroup ? "hidden" : "block"
            } text-white flex justify-center items-center rounded-full`}
          >
            {userIsFriend ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                width="25"
                height="25"
                fill="white"
              >
                <path d="M640-520v-80h240v80H640Zm-280 40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                width="25"
                height="25"
                fill="white"
              >
                <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
              </svg>
            )}

            {/* Friend request sent icon... TO BE ADDED */}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              width="25"
              height="25"
              fill="white"
            >
              <path d="M702-480 560-622l57-56 85 85 170-170 56 57-226 226Zm-342 0q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 260Zm0-340Z" />
            </svg> */}
          </button>
        </div>
      </div>

      <div className="flex flex-col p-3">
        <h1 className="font-bold mb-5">Chat Info</h1>

        <input
          placeholder="Search in conversation"
          className="bg-white shadow-md p-1 rounded-full px-3"
          // style={{ fontFamily: "Arial", "FontAwesome" }}
        />

        <div className="pt-3">
          <div
            className="p-3 flex shadow-md cursor-pointer"
            onClick={() => setChatinfoActive((prev) => !prev)}
          >
            <p className="align-middle">Chat Info</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="30"
              height="30"
              fill="#53575a"
              className={`ml-auto transition-transform ${
                chatInfoActive ? "rotate-180" : "rotate-0"
              }`}
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          </div>

          {/* Group members list */}
          <div
            className={`p-3 flex shadow-md cursor-pointer ${activeConvoIsGroup ? "block" : "hidden"}`}
            onClick={() => setMembersActive((prev) => !prev)}
          >
            <p className="align-middle">Members</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="30"
              height="30"
              fill="#53575a"
              className={`ml-auto transition-transform ${
                membersActive ? "rotate-180" : "rotate-0"
              }`}
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          </div>

          <div
            className="p-3 flex shadow-md cursor-pointer"
            onClick={() => setCustomizeActive((prev) => !prev)}
          >
            <p className="align-middle">Customize Chat</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="30"
              height="30"
              fill="#53575a"
              className={`ml-auto transition-transform ${
                customizeActive ? "rotate-180" : "rotate-0"
              }`}
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          </div>

          <div
            className={`p-3 flex flex-col ${
              customizeActive ? "block" : "hidden"
            }`}
          >
            {/* Change Theme */}
            <div className="flex gap-2 p-1 cursor-pointer">
              {/* Icon */}
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  width="25"
                  height="25"
                  fill="#53575a"
                >
                  <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z" />
                </svg>
              </div>
              {/* Text */}
              <div>Change Theme</div>
            </div>

            {/* Change Emoji */}
            <div className=" flex gap-2 p-1 cursor-pointer">
              {/* Icon */}
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  width="25"
                  height="25"
                  fill="#53575a"
                >
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                </svg>
              </div>
              {/* Text */}
              <div>Change Emoji</div>
            </div>

            {/* Change Nickname */}
            <div className="flex gap-2 p-1 cursor-pointer">
              {/* Icon */}
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  width="25"
                  height="25"
                  fill="#53575a"
                >
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                </svg>
              </div>
              {/* Text */}
              <div>Change Nickname</div>
            </div>
          </div>

          <div
            className="p-3 flex shadow-md cursor-pointer"
            onClick={() => setFilesActive((prev) => !prev)}
          >
            <p className="align-middle">Files</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="30"
              height="30"
              fill="#53575a"
              className={`ml-auto transition-transform ${
                filesActive ? "rotate-180" : "rotate-0"
              }`}
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          </div>

          {/* Div for toggling list of images */}
          <div
            className="p-3 flex shadow-md cursor-pointer"
            onClick={() => {
              setImagesActive((prev) => !prev);
            }}
          >
            <p className="align-middle">Images</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="30"
              height="30"
              fill="#53575a"
              className={`ml-auto transition-transform ${
                imagesActive ? "rotate-180" : "rotate-0"
              }`}
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          </div>
          <div
            className={`grid grid-cols-3 bg-amber-200 transition-all duration-500 ${
              imagesActive ? "block" : "hidden"
            }`}
          >
            {mediaImages.map((imageBlob, idx) => (
              <img
                key={idx}
                src={imageBlob}
                className="w-30 h-30 object-cover cursor-pointer"
              ></img>
            ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
