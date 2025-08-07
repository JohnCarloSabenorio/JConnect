import axios from "axios";

export async function getAllUsers() {
  try {
    const response = await axios.get("jconnect/api/v1/users", {
      withCredentials: true,
    });

    return response.data.data;
  } catch (error) {
    console.log("Error getting all users:", error);
  }
}

export async function getUser(userId) {
  try {
    const response = await axios.get(`jconnect/api/v1/users/${userId}`, {
      withCredentials: true,
    });

    return response.data.data;
  } catch (error) {
    console.log("Error getting all users:", error);
  }
}

export async function changePassword(
  currentPassword,
  newPassword,
  confirmNewPassword
) {
  try {
    const response = await axios.patch(
      `jconnect/api/v1/users/updatePassword`,
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
