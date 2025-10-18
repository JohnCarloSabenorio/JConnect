import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { isTokenValid } from "../api/user";
import { resetPassword } from "../api/user";
export default function ResetPassword() {
  const { token } = useParams();
  const [isValidating, setIsValidating] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    // Check if the token is valid
    async function validatePasswordResetToken() {
      const isValid = await isTokenValid(token);

      if (!isValid) {
        window.location.assign("/");
      } else {
        setIsValidating(false);
      }
    }

    validatePasswordResetToken();
  }, []);

  async function submitResetPassword() {
    const response = await resetPassword(
      newPassword,
      confirmNewPassword,
      token
    );

    if (response.status == 200) {
      resetPasswordInputs();
      setPasswordUpdated(true);
      setErrorMessages([]);
    } else {
      setErrorMessages(response.data.errorMessages);
      setPasswordUpdated(false);
      resetPasswordInputs();
    }

    console.log("error messages:", errorMessages);
  }

  function resetPasswordInputs() {
    setNewPassword("");
    setConfirmNewPassword("");
  }

  if (isValidating) {
    return <></>;
  } else {
    return (
      <>
        <div className="bg-[url(/images/backgrounds/auth-bg.jpg)] bg-no-repeat bg-cover bg-right-bottom flex flex-col items-center justify-center h-screen">
          <div className="flex bg-gray-50 w-2xl rounded-lg overflow-hidden border-black shadow-2xl">
            {passwordUpdated ? (
              <div className="flex flex-col w-full p-20 py-10 px-10">
                <h1 className="text-5xl font-bold text-green-500 text-center">
                  Password Reset Successful!
                </h1>

                <a
                  href="/"
                  className="text-lg text-center mt-5 hover:font-semibold cursor-pointer"
                >
                  Login Now!
                </a>
              </div>
            ) : (
              <div className="flex flex-col w-full p-20 py-10 px-10">
                <h1 className="text-5xl font-bold text-green-500 text-center">
                  Reset Password
                </h1>

                <div
                  className={`${
                    errorMessages.length > 0 ? "block" : "hidden"
                  } bg-red-300 border-2 border-red-400 rounded-md p-3 mt-3`}
                >
                  <ul className="list-disc list-inside">
                    {errorMessages.map((err, idx) => (
                      <li className="italic" key={idx}>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-center mt-5">
                  {/* New Password */}
                  <div className={`w-full`}>
                    <label htmlFor="newPassword" className="font-semibold">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="rounded-md grow px-3 py-2 block bg-gray-100 w-full"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  {/* Confirm New Password */}

                  <div className={`w-full`}>
                    <label htmlFor="password2" className="font-semibold">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="rounded-md grow px-3 py-2 block bg-gray-100 w-full"
                      name="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={(e) => submitResetPassword()}
                  className={`mt-3 bg-blue-200 px-5 py-2 cursor-pointer rounded-md hover:bg-blue-400 hover:text-white`}
                >
                  Reset Password
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
