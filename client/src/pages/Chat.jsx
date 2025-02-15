export default function Chat() {
  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <div className="bg-gray-400 shadow-md flex justify-between p-5">
          <div className="">
            <h1 className="pb-2 text-4xl text-gray-800 font-bold">JConnect</h1>
          </div>

          <div class="flex gap-5">
            <button>Toggle</button>

            <button
              class="group relative border-gray-300 cursor-pointer"
              type="button"
            >
              <img
                src="/img/icons/male-default.jpg"
                className="rounded-full w-12 h-12"
              />

              <div class="absolute top-full right-0 rounded-lg p-3 bg-gray-50 mt-1  shadow-lg scale-y-0 group-focus:scale-y-100 origin-top duration-100 flex flex-col">
                <a class="active">Profile</a>
                <a>Settings</a>
                <a>Logout</a>
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-grow">
          <div className="bg-white shadow-md mr-0.3">
            <div className="flex items-center justify-center gap-8 p-3 bg-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="30"
                height="30"
                fill="black"
              >
                <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l96 0 0 80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416 448 416c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="30"
                height="30"
                fill="black"
              >
                <path d="M96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L96 0zM208 288l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64zM496 192c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                width="30"
                height="30"
                fill="black"
              >
                <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="30"
                height="30"
                fill="black"
              >
                <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
              </svg>
            </div>

            <div className="flex flex-col p-5 pt-2">
              <h1 className="text-3xl font-bold">Chats</h1>
              <input
                type="text"
                className="mt-3 rounded-full p-1 px-2 bg-white shadow-md"
                placeholder="&#xF002; Search..."
                // style={{ fontFamily: "Arial", "FontAwesome" }}
              />

              <div className="mt-5 flex flex-col gap-2">
                <div className="bg-white rounded-md flex p-5 shadow-md">
                  <img
                    src="/img/icons/male-default.jpg"
                    className="rounded-full w-12 h-12"
                  />
                  <div className="px-3">
                    <p>John Doe</p>
                    <p>How about we play or...</p>
                  </div>
                  <div>
                    <p>3:26 PM</p>
                    <p className="text-right font-bold">22</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-4xl bg-gray-50">
            <div className="shadow-md flex p-3 gap-5 px-10 bg-white">
              <img
                src="/img/icons/male-default.jpg"
                className="rounded-full w-12 h-12"
              />
              <div>
                <p className="font-bold text-md">John Doe</p>
                <p className="text-gray-600">Last active 1 hour ago</p>
              </div>
              <div className="flex gap-5 ml-auto items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="30"
                  height="30"
                  fill="black"
                >
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  width="30"
                  height="30"
                  fill="black"
                >
                  <path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="30"
                  height="30"
                  fill="black"
                >
                  <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col p-5">
              <div className="flex gap-2">
                <img
                  src="/img/icons/male-default.jpg"
                  className="rounded-full w-12 h-12"
                />
                <div className="max-w-max bg-green-400 p-2 rounded-sm">
                  <p className="break-all">This is a sample friend message!</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-5">
              <div className="ml-auto flex gap-2">
                <div className="max-w-max bg-blue-400 p-2 rounded-sm">
                  <p className="break-all">This is a sample user message!</p>
                </div>
                <img
                  src="/img/icons/male-default.jpg"
                  className="rounded-full w-12 h-12"
                />
              </div>
            </div>
            <div className="flex mt-auto p-3">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="30"
                  height="30"
                  fill="black"
                >
                  <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
                </svg>
              </div>
              <input
                className="flex-grow mx-4 p-2"
                type="text"
                placeholder="Type your message here..."
              />
              <div className="flex items-center justify-center ml-auto gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="30"
                  height="30"
                  fill="black"
                >
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="30"
                  height="30"
                  fill="black"
                >
                  <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-grow bg-white shadow-md">
            <div className="flex flex-col items-center justify-center p-10">
              <img
                src="/img/icons/male-default.jpg"
                className="rounded-full w-30 h-30"
              />
              <p className="font-bold">John Doe</p>
              <p className="text-gray-500">johndoe@gmail.com</p>
            </div>
            <div className="flex flex-col p-3">
              <h1 className="font-bold mb-5">Chat Info</h1>
              <input
                placeholder="&#xF002; Search in conversation"
                className="bg-white shadow-md p-1 rounded-full px-3"
                // style={{ fontFamily: "Arial", "FontAwesome" }}
              />

              <div className="pt-3">
                <div className="p-3 flex shadow-md">
                  <p className="align-middle">Files</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    width="30"
                    height="30"
                    fill="#53575a"
                    className="ml-auto"
                  >
                    <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                  </svg>
                </div>
                <div className="p-3 flex shadow-md">
                  <p className="align-middle">Images</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    width="30"
                    height="30"
                    fill="#53575a"
                    className="ml-auto"
                  >
                    <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                  </svg>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}
