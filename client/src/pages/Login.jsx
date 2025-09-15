import { useContext, useState, useEffect } from "react";
import { login } from "../api/authenticate.js";

export default function Login() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await login(email, password);
      window.location.assign("/chat");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="bg-[url(/images/backgrounds/sky.jpg)] bg-no-repeat bg-cover bg-right-bottom flex flex-col items-center justify-center h-screen">
        <div className="flex bg-gray-50 w-5xl rounded overflow-hidden border-black border-1 shadow-2xl">
          <div className="w-4xl bg-[url(/images/backgrounds/blue-bg.png)] bg-center bg-cover flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-green-400">JConnect</h1>
            <p className="text-green-400 text-xl mt-3 text-center px-12">
              Welcome back! Reconnect, chat, and share moments with your friends
              online
            </p>

            <p className="text-green-400 italic text-xl mt-20">
              Don't have an account?
            </p>
            <button
              className="bg-green-400 cursor-pointer uppercase font-semibold tracking-wider border-black rounded-md border-1 py-2 px-10 text-xl mt-5 shadow-md"
              type="button"
              onClick={() => {
                window.location.assign("/register");
              }}
            >
              Sign Up Here
            </button>
          </div>

          <div className="flex flex-col w-full p-20 px-24">
            <h1 className="text-5xl font-bold text-green-500">Sign In</h1>

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
          </div>
        </div>
      </div>
    </>
  );
}
