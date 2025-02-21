import axios from "axios";

export async function getRecentConversation() {
  try {
    console.log("Getting all conversations...");

    const response = await axios.get(
      "/jconnect/api/v1/users/allConvo?sort=-updatedAt",
      { withCredentials: true }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
}

export async function getFriendsConversation() {
  try {
    console.log("Getting friend conversations...");
    // Create an api to get friend conversations
    const response = await axios.get(
      "/jconnect/api/v1/friends/currentUser/allFriends",
      { withCredentials: true }
    );

    return response.data.data;
  } catch (err) {
    console.error("Error fetching user conversations:", err);
  }
}

export async function getAllUserMessages(convoId) {
  console.log("Getting user messages...");

  // Retrieve messages by the order of creation
  try {
    // Gets the friends of the user
    const response = await axios.get(
      `/jconnect/api/v1/conversation/${convoId}/message?sort=createdAt`,
      { withCredentials: true }
    );

    return response.data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function createConversation() {
  console.log("Creating conversation...");
}
