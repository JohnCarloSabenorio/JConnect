import axios from "axios";
export async function createNotification(body) {
  try {
    const response = await axios.post("jconnect/api/v1/notification", body, {
      withCredentials: true,
    });

    return response.data.data;
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
export async function deleteNotification(notificationId) {
  try {
    await axios.delete(`jconnect/api/v1/notification/${notificationId}`, {
      withCredentials: true,
    });
  } catch (err) {
    console.log("Error ");
  }
}

export async function getNotification(userId) {}
export async function updateNotification(userId) {}
