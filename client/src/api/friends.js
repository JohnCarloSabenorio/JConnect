import axios from "axios";
export async function getFriends() {
  try {
    // Get friends
    const response = await axios.get(
      "https://jconnect-server.onrender.com/api/v1/friends/currentUser/allFriends",
      {
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getNonUserFriends() {
  try {
    const response = await axios.get(
      "https://jconnect-server.onrender.com/api/v1/friends/non-friends",
      {
        withCredentials: true,
      }
    );

    return response.data.nonFriends;
  } catch (err) {
    console.log(err);
  }
}

export async function getFriend() {
  try {
    // Get friends
    const response = await axios.get(
      "https://jconnect-server.onrender.com/api/v1/friends/currentUser/allFriends",
      {
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function isFriend(userId) {
  try {
    // Check if the user is a friend
    const response = await axios.get(
      `https://jconnect-server.onrender.com/api/v1/friends/isFriend/${userId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.isFriend;
  } catch (err) {
    console.log(err);
  }
}

export async function sendFriendRequest(userId) {
  try {
    const response = await axios.post(
      `https://jconnect-server.onrender.com/api/v1/friends/friendRequest/${userId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (err) {
    console.log("Error sending friend request:", err);
  }
}
export async function cancelFriendRequest(userId) {
  try {
    const response = await axios.delete(
      `https://jconnect-server.onrender.com/api/v1/friends/cancelRequest/${userId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (err) {
    console.log("Error sending friend request:", err);
  }
}
export async function rejectFriendRequest(userId) {
  try {
    const response = await axios.delete(
      `https://jconnect-server.onrender.com/api/v1/friends/rejectRequest/${userId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (err) {
    console.log("Error sending friend request:", err);
  }
}
export async function removeFriend(userId) {
  try {
    const response = await axios.delete(
      `https://jconnect-server.onrender.com/api/v1/friends/${userId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } catch (err) {
    console.log("Error sending friend request:", err);
  }
}

export async function acceptFriendRequest(userId) {
  try {
    const response = await axios.patch(
      `https://jconnect-server.onrender.com/api/v1/friends/acceptRequest/${userId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.data;
  } catch (err) {
    console.log("Error accepting friend request:", err);
  }
}

export async function isRequestSentToUser(userId) {
  try {
    const response = await axios.get(
      `https://jconnect-server.onrender.com/api/v1/friends/isRequestSent/${userId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.isRequestSent;
  } catch (err) {
    console.log("Error in checking if request is sent to user:", err);
  }
}
export async function isRequestReceived(userId) {
  try {
    const response = await axios.get(
      `https://jconnect-server.onrender.com/api/v1/friends/isRequestReceived/${userId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.isRequestReceived;
  } catch (err) {
    console.log("Error in checking if request is sent to user:", err);
  }
}

export async function findMutualFriends(userId) {
  try {
    const response = await axios.get(
      `https://jconnect-server.onrender.com/api/v1/friends/mutual-friends/${userId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.mutualFriends;
  } catch (err) {
    console.log("Error finding mutual friends:", userId);
  }
}
