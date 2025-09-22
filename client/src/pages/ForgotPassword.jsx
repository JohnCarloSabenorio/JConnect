import { useContext, useState, useEffect } from "react";
import { login } from "../api/authenticate.js";
import { forgotPassword } from "../api/authenticate.js";

export default function ForgotPassword() {
  let [email, setEmail] = useState("");
  let [buttonLabel, setButtonLabel] = useState("send email");
  let [isEmailSent, setIsEmailSent] = useState(false);
  let [emailIsValid, setEmailIsValid] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  async function submitEmail() {
    setButtonLabel("Sending email...");
    const response = await forgotPassword(email);

    if (response.status == 200) {
      setIsEmailSent(true);
      setEmailIsValid(true);
      setTimeLeft(600);
    } else {
      setEmailIsValid(false);
    }

    setButtonLabel("Send email");
    console.log("submit email response:", response);
  }

  return (
    <>
      <div className="bg-[url(/images/backgrounds/auth-bg.jpg)] bg-no-repeat bg-cover bg-right-bottom flex flex-col items-center justify-center h-screen">
        <div className="flex bg-gray-50 w-2xl rounded-lg overflow-hidden border-black shadow-2xl">
          <div className="flex flex-col w-full p-20 py-10 px-10">
            <h1 className="text-5xl font-bold text-green-500 text-center">
              Forgot Password
            </h1>

            <p className="text-center mt-5">
              {" "}
              Please enter your email address below. We’ll send you a link to
              reset your password.
            </p>
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

            <div className="flex flex-col items-center mt-5">
              {emailIsValid ? (
                <p
                  className={`${
                    isEmailSent ? "block" : "hidden"
                  } text-green-800 font-semibold`}
                >
                  Email Sent! The token will expire in{" "}
                  {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </p>
              ) : (
                <p className="text-red-800">Invalid email. Please try again.</p>
              )}

              <button
                onClick={(e) => submitEmail()}
                className="cursor-pointer bg-green-400 uppercase font-semibold tracking-wider border-black rounded-md border-1 py-2 px-10 text-xl mt-5 shadow-md"
              >
                {buttonLabel}
              </button>
              <p
                className="mt-5 cursor-pointer hover:font-semibold"
                onClick={(e) => window.location.assign("/")}
              >
                Back
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
