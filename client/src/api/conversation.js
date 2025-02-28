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

export async function getAllGroupConversation() {
  try {
    console.log("Getting all group conversations...");

    const response = await axios.get(
      "/jconnect/api/v1/users/allConvo?minUsers=2&sort=-updatedAt",
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

    console.log("FRIENDS CONVO:", response);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching user conversations:", err);
  }
}

export async function getAllUserMessages(convoId) {
  console.log("Getting user messages...");

  // Retrieve messages by the order of creation
  try {
    // Gets the conversation of the user
    const response = await axios.get(
      `/jconnect/api/v1/conversation/${convoId}/message?sort=createdAt`,
      { withCredentials: true }
    );

    

    console.log("THE RESPONSE DATA FOR USER MSESAGES", response);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function createConversation(userId, friendId) {
  console.log("Creating conversation...");
  try {
    const response = await axios.post(
      `/jconnect/api/v1/conversation`,
      {
        users: [userId, friendId],
      },
      {
        withCredentials: true,
      }
    );

    console.log("A CONVO HAS BEEN CREATED!");
    return response.data.data;
  } catch (err) {
    console.log("Failed to chat with friend:", err);
  }
}

export async function chatWithFriend(friendId) {
  // Check if the user has an existing conversation with a friend
  try {
    const response = await axios.get(
      `jconnect/api/v1/friends/checkConvo/${friendId}/checkConvoExists`,
      {
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (err) {
    console.log("Failed to chat with friend:", err);
  }
}
