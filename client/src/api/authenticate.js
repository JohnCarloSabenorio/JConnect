import axios from "axios";

export async function login(email, password) {
  try {
    const response = await axios.post(
      "http://localhost:3000/jconnect/api/v1/users/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    console.log("User logged in!");
    window.location.assign("/chat");
  } catch (err) {
    console.log(err);
  }
}

export async function register(username, email, password, passwordConfirm) {
  try {
    const response = await axios.post(
      "http://localhost:3000/jconnect/api/v1/users/signup",
      { username, email, password, passwordConfirm },
      {
        withCredentials: true,
      }
    );

    console.log("User signed up!");
    console.log(response.data);
    window.location.assign("/chat");
  } catch (err) {
    console.log(err);
  }
}

export async function logout() {
  try {
    const response = await axios.post(
      "http://localhost:3000/jconnect/api/v1/users/logout"
    );
  } catch (err) {
    console.log(err);
  }
}
