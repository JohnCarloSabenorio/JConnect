import axios from "axios";
export async function login(email, password, isRemembered) {
  try {
    const response = await axios.post(
      "https://jconnect-server.onrender.com/api/v1/users/login",
      {
        email,
        password,
        isRemembered,
      },
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (err) {
    return err.response;
  }
}

export async function register(username, email, password, passwordConfirm) {
  try {
    const response = await axios.post(
      "https://jconnect-server.onrender.com/api/v1/users/signup",
      { username, email, password, passwordConfirm },
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (err) {
    return err.response;
  }
}

export async function logout() {
  try {
    const response = await axios.get(
      "https://jconnect-server.onrender.com/api/v1/users/logout",
      {
        withCredentials: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
}

export async function isLoggedIn() {
  try {
    const response = await axios.get(
      "https://jconnect-server.onrender.com/api/v1/users/isLoggedIn",
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (err) {
    console.log("Failed to check if user is logged in!");
  }
}

export async function forgotPassword(email) {
  try {
    const response = await axios.post(
      "https://jconnect-server.onrender.com/api/v1/users/forgotPassword",
      {
        email,
      },
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (err) {
    return err.response;
  }
}
