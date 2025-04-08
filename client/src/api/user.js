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
