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
