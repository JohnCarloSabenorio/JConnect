import axios from "axios";
export async function login(email, password) {
  try {
    const response = await axios.post(
      "/jconnect/api/v1/users/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

  } catch (err) {
    console.log(err);
  }
}

export async function register(username, email, password, passwordConfirm) {
  try {
    const response = await axios.post(
      "/jconnect/api/v1/users/signup",
      { username, email, password, passwordConfirm },
      {
        withCredentials: true,
      }
    );

    window.location.assign("/chat");
  } catch (err) {
    console.log(err);
  }
}

export async function logout() {
  try {
    const response = await axios.get("/jconnect/api/v1/users/logout", {
      withCredentials: true,
    });

    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

export async function isLoggedIn() {
  try {
    const response = await axios.get(
      "/jconnect/api/v1/users/isLoggedIn",
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (err) {
    console.log("Failed to check if user is logged in!");
  }
}
