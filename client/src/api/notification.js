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
    console.log("getting all the mofo notifications...");
    const response = await axios.get(
      "jconnect/api/v1/notification?sort=updatedAt",
      {
        withCredentials: true,
      }
    );

    console.log("notifications retrieved:", response.data);
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

export async function updateAllUserNotifications(newData) {
  try {
    const response = await axios.patch(
      `jconnect/api/v1/notification/update-user-notifs`,
      newData,
      { withCredentials: true }
    );

    console.log(response);
  } catch (err) {
    console.log("Error updating all notifications:", err);
  }
}

export async function getNotification(userId) {}
