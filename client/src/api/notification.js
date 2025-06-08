import axios from "axios";
export async function createNotification(body) {
  try {
    const response = await axios.post("jconnect/api/v1/notification", body, {
      withCredentials: true,
    });

    console.log(response);
  } catch (err) {
    console.log("Error creating a new notification:", err);
  }
}

export async function getAllNotifications() {
  try {
    const response = await axios.get("jconnect/api/v1/notification", {
      withCredentials: true,
    });
    return response.data.data;
  } catch (err) {
    console.log("Error getting a new notification:", err);
  }
}
export async function getNotification(userId) {}
export async function updateNotification(userId) {}
export async function deleteNotification(userId) {}
