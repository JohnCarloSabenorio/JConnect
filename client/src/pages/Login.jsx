import { useContext, useState, useEffect } from "react";
import { login } from "../api/authenticate.js";

export default function Login() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [isInvalid, setIsInvalid] = useState(false);
  let [isRemembered, setIsRemembered] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await login(email, password, isRemembered);

      if (response.status == 200) {
        setIsInvalid(false);
        window.location.assign("/chat");
      } else {
        setIsInvalid(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="bg-[url(/images/backgrounds/auth-bg.jpg)] bg-no-repeat bg-cover bg-right-bottom flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col w-full bg-gray-50 md:w-xl lg:flex-row rounded-lg overflow-hidden border-black shadow-2xl">
          <div className="flex flex-col w-full p-10">
            <h1 className="text-5xl font-bold text-green-500">Sign In</h1>

            <form
              onSubmit={handleSubmit}
              id="login-form"
              className="flex flex-col mt-7"
            >
              <p
                className={`mb-3 text-center text-red-600 ${
                  isInvalid ? "block" : "hidden"
                }`}
              >
                Invalid email or password
              </p>

              <label htmlFor="email">Email</label>
              <input
                className="border-black border-1 rounded-sm text-md p-2 bg-gray-50"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <label className="mt-5" htmlFor="password">
                Password
              </label>
              <input
                className="border-black border-1 rounded-sm text-md p-2 bg-gray-50"
                type="password"
                name="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div className="flex mt-5">
                <div className="justify-self-end flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="remember"
                    onChange={(e) => setIsRemembered(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember Me</label>
                </div>
                <a
                  className="ml-auto cursor-pointer hover:font-semibold"
                  onClick={() => {
                    window.location.assign("/forgot-password");
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              <p className="text-center mt-3">
                Don't have an account?{" "}
                <a href="/register" className="underline hover:font-semibold">
                  Sign up
                </a>
                .
              </p>
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
