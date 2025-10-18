import axios from "axios";
const serverHost = import.meta.env.VITE_SERVER_HOST;
const localServer = import.meta.env.VITE_LOCAL_SERVER;
const viteEnv = import.meta.env.VITE_ENV;

export async function getAllUsers() {
  try {
    const response = await axios.get(
      `${viteEnv === "production" ? serverHost : localServer}/api/v1/users`,
      {
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (error) {
    console.log("Error getting all users:", error);
  }
}

export async function getUser(userId) {
  try {
    const response = await axios.get(
      `${
        viteEnv === "production" ? serverHost : localServer
      }/api/v1/users/${userId}`,
      {
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (error) {
    console.log("Error getting all users:", error);
  }
}

export async function updateCurrentUser(data) {
  try {
    const response = await axios.patch(
      `${
        viteEnv === "production" ? serverHost : localServer
      }/api/v1/users/updateMe`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const responseData = response.data;
    return responseData.data;
  } catch (err) {
    console.log("Error updating users:", err);
  }
}

export async function changePassword(
  currentPassword,
  newPassword,
  confirmNewPassword
) {
  try {
    const response = await axios.patch(
      `${
        viteEnv === "production" ? serverHost : localServer
      }/api/v1/users/updatePassword`,
      {
        currentPassword,
        newPassword,
        confirmNewPassword,
      },
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    console.log("Error getting all users:", error);
    return error;
  }
}
export async function resetPassword(newPassword, confirmNewPassword, token) {
  try {
    const response = await axios.patch(
      `${
        viteEnv === "production" ? serverHost : localServer
      }/api/v1/users/resetPassword/${token}`,
      {
        newPassword,
        confirmNewPassword,
      },
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
}

export async function isTokenValid(token) {
  try {
    const response = await axios.get(
      `${
        viteEnv === "production" ? serverHost : localServer
      }/api/v1/users/isTokenValid/${token}`,
      {
        withCredentials: true,
      }
    );

    return response.data.isTokenValid;
  } catch (err) {
    console.log("Token is invalid:", err.response.data.istokenValid);
    return err.response.data.isTokenValid;
  }
}
