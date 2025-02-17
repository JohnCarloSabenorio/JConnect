import { useContext, useState, useEffect } from "react";
import { login } from "../api/authenticate.js";
export default function Login(props) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="bg-[url(/img/backgrounds/sky.jpg)] bg-no-repeat bg-cover bg-right-bottom flex flex-col items-center justify-center h-screen">
        <div className="flex bg-gray-50 w-5xl rounded overflow-hidden border-black border-1 shadow-2xl">
          <div className="w-4xl bg-[url(/img/backgrounds/blue-bg.png)] bg-center bg-cover flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-green-400">JConnect</h1>
            <p className="text-green-400 text-xl mt-3 text-center px-12">
              Welcome back! Reconnect, chat, and share moments with your friends
              online
            </p>

            <p className="text-green-400 italic text-xl mt-20">
              Don't have an account?
            </p>
            <button
              className="bg-green-400 uppercase font-semibold tracking-wider border-black rounded-md border-1 py-2 px-10 text-xl mt-5 shadow-md"
              type="button"
            >
              Sign Up Here
            </button>
          </div>

          <div className="flex flex-col w-full p-20 px-24">
            <h1 className="text-5xl font-bold text-green-500">Sign </h1>

            <form
              onSubmit={handleSubmit}
              id="login-form"
              className="flex flex-col mt-12"
            >
              <label htmlFor="email">Email</label>
              <input
                className="border-black border-1 rounded-sm text-md p-2 bg-gray-50 shadow-md"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <label className="mt-5" htmlFor="password">
                Password
              </label>
              <input
                className="border-black border-1 rounded-sm text-md p-2 bg-gray-50 shadow-md"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div className="flex mt-5">
                <div className="justify-self-end">
                  <input type="checkbox" name="remember" />
                  <label htmlFor="remember">Remember Me</label>
                </div>
                <a className="ml-auto">Forgot Password?</a>
              </div>
              <div className="flex flex-col items-center">
                <button className="cursor-pointer bg-green-400 uppercase font-semibold tracking-wider border-black rounded-md border-1 py-2 px-10 text-xl mt-5 shadow-md">
                  Sign In
                </button>
              </div>
            </form>
            <div className="flex items-center justify-center mt-10">
              <div className="h-0.5 w-full bg-gray-400 mr-5 align-middle"></div>
              <p className="leading-none">or&nbsp;sign&nbsp;in&nbsp;with</p>
              <div className="h-0.5 w-full bg-gray-400 ml-5 align-middle"></div>
            </div>
            <div className="signup-btn-container flex justify-center gap-10 mt-10">
              <button type="button" className="w-14 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 256 256"
                >
                  <g
                    fill="none"
                    fillRule="nonzero"
                    stroke="none"
                    strokeWidth="1"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    strokeMiterlimit="10"
                    strokeDasharray=""
                    strokeDashoffset="0"
                    fontFamily="none"
                    fontWeight="none"
                    fontSize="none"
                    textAnchor="none"
                    style={{ mixBlendMode: "normal" }}
                  >
                    <g transform="scale(5.33333,5.33333)">
                      <path
                        d="M24,5c-10.49341,0 -19,8.50659 -19,19c0,10.49341 8.50659,19 19,19c10.49341,0 19,-8.50659 19,-19c0,-10.49341 -8.50659,-19 -19,-19z"
                        fill="#3f51b5"
                      />
                      <path
                        d="M26.572,29.036h4.917l0.772,-4.995h-5.69v-2.73c0,-2.075 0.678,-3.915 2.619,-3.915h3.119v-4.359c-0.548,-0.074 -1.707,-0.236 -3.897,-0.236c-4.573,0 -7.254,2.415 -7.254,7.917v3.323h-4.701v4.995h4.701v13.729c0.931,0.14 1.874,0.235 2.842,0.235c0.875,0 1.729,-0.08 2.572,-0.194z"
                        fill="#ffffff"
                      />
                    </g>
                  </g>
                </svg>
              </button>
              <button type="button" className="rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="60"
                  height="60"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#fbc02d"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#e53935"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4caf50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1565c0"
                    d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              </button>
              <button type="button" className="w-14 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="60"
                  height="60"
                  viewBox="0 0 50 50"
                >
                  <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
