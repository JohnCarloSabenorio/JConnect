import axios from "axios";
const serverHost = import.meta.env.VITE_SERVER_HOST;
const localServer = import.meta.env.VITE_LOCAL_SERVER;
const viteEnv = import.meta.env.VITE_ENV;

export async function createNotification(body) {
  try {
    const response = await axios.post(
      `${
        viteEnv === "production" ? serverHost : localServer
      }/api/v1/notification`,
      body,
      {
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (err) {
    console.log("Error creating a new notification:", err);
  }
}

export async function getAllNotifications() {
  try {
    const response = await axios.get(
      `${
        viteEnv === "production" ? serverHost : localServer
      }/api/v1/notification?sort=-createdAt`,
      {
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (err) {
    console.log("Error getting a new notification:", err);
  }
}
export async function deleteNotification(notificationId) {
  try {
    await axios.delete(
      `${
        viteEnv === "production" ? serverHost : localServer
      }/api/v1/notification/${notificationId}`,
      {
        withCredentials: true,
      }
    );
  } catch (err) {
    console.log("Error ");
  }
}

export async function updateAllUserNotifications(newData) {
  try {
    const response = await axios.patch(
      `${
        viteEnv === "production" ? serverHost : localServer
      }/api/v1/notification/update-user-notifs`,
      newData,
      { withCredentials: true }
    );
  } catch (err) {
    console.log("Error updating all notifications:", err);
  }
}

export async function getNotification(userId) {}
