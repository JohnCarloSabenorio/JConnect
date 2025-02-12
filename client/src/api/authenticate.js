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
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function register(email, password, passwordConfirm) {
  try {
    const response = await axios.post(
      "http://localhost:3000/jconnect/api/v1/users/signup",
      {
        withCredentials: true,
      }
    );

    console.log("User signed up!");
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}
