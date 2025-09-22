import { useContext, useState } from "react";
import { register } from "../api/authenticate.js";

export default function Register() {
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [passwordConfirm, setPasswordConfirm] = useState("");

  let [signupErrors, setSignupErrors] = useState([]);

  async function handleSubmit(e) {
    // handle register form submission here using authenticate.js's register
    e.preventDefault();

    try {
      const response = await register(
        username,
        email,
        password,
        passwordConfirm
      );

      if (response.status != 200) {
        setSignupErrors(response.data.errors);
      } else {
        setSignupErrors([]);
        window.location.assign("/chat");
      }

      console.log("registration response:", response);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="bg-[url(/images/backgrounds/auth-bg.jpg)] bg-no-repeat bg-cover bg-right-bottom flex flex-col items-center justify-center h-screen">
        <div className="flex bg-gray-50 w-4xl rounded-lg overflow-hidden border-black shadow-2xl">
          <div className="w-4xl bg-[url(/images/backgrounds/blue-bg.png)] bg-center bg-cover flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-green-400">JConnect</h1>
            <p className="text-green-400 text-xl mt-3 text-center px-12">
              Welcome back! Reconnect, chat, and share moments with your friends
              online
            </p>

            <p className="text-green-400 italic text-xl mt-20">
              Already have an account?
            </p>
            <button
              className="bg-green-400 cursor-pointer uppercase font-semibold tracking-wider border-black rounded-md border-1 py-2 px-10 text-xl mt-5 shadow-md"
              type="button"
              onClick={() => {
                window.location.assign("/");
              }}
            >
              Sign In Here
            </button>
          </div>

          <div className="flex flex-col w-full p-20 px-10">
            <h1 className="text-5xl font-bold text-green-500">Sign up</h1>

            {/* Errors div */}
            <div
              className={`${
                signupErrors.length > 0 ? "block" : "hidden"
              } bg-red-300 border-2 border-red-400 rounded-md p-3 mt-3`}
            >
              <ul className="list-disc list-inside">
                {signupErrors.map((err, idx) => (
                  <li className="italic" key={idx}>
                    {err}
                  </li>
                ))}
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col mt-2">
              <label htmlFor="username">Username</label>
              <input
                className="border-black border-1 rounded-sm text-md p-2 bg-gray-50 shadow-md"
                required={true}
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <label htmlFor="email">Email</label>
              <input
                className="border-black border-1 rounded-sm text-md p-2 bg-gray-50 shadow-md"
                required={true}
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
                required={true}
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <label className="mt-5" htmlFor="passwordConfirm">
                Confirm Password
              </label>
              <input
                className="border-black border-1 rounded-sm text-md p-2 bg-gray-50 shadow-md"
                required={true}
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                }}
              />
              <div className="flex flex-col items-center mt-5">
                <button className="cursor-pointer bg-green-400 uppercase font-semibold tracking-wider border-black rounded-md border-1 py-2 px-10 text-xl mt-5 shadow-md">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
