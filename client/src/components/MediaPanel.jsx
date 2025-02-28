import { useState } from "react";
export default function MediaPanel({ convoName, mediaImages }) {
  const [imagesActive, setImagesActive] = useState(false);
  const [filesActive, setFilesActive] = useState(false);
  const [customizeActive, setCustomizeActive] = useState(false);
  const [chatInfoActive, setChatinfoActive] = useState(false);

  // console.log("THE MEDIA IMAGES:", mediaImages);

  return (
    <div className="border-0.5 w-100 h-full overflow-y-scroll">
      <div className="flex flex-col items-center justify-center p-10">
        <img
          src="/img/icons/male-default.jpg"
          className="rounded-full w-30 h-30"
        />
        <p className="font-bold">{convoName}</p>
        {/* <p className="text-gray-500">johndoe@gmail.com</p> */}
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
