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

export async function updateCurrentUser(data) {
  try {
    const response = await axios.patch(`jconnect/api/v1/users/updateMe`, data, {
      withCredentials: true,
    });

    const responseData = response.data;
    console.log("updated current user:", responseData);
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
