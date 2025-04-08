import axios from "axios";
export async function getFriends() {
  try {
    // Get friends
    const response = await axios.get(
      "jconnect/api/v1/friends/currentUser/allFriends",
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
    const response = await axios.get("jconnect/api/v1/friends/non-friends", {
      withCredentials: true,
    });

    return response.data.nonFriends;
  } catch (err) {
    console.log(err);
  }
}

export async function getFriend() {
  try {
    // Get friends
    const response = await axios.get(
      "jconnect/api/v1/friends/currentUser/allFriends",
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
      `jconnect/api/v1/friends/isFriend/${userId}`
    );

    return response.data.isFriend;
  } catch (err) {
    console.log(err);
  }
}
