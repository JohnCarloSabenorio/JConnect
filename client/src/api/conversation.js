import axios from "axios";

export async function getAllUserConversation() {
  try {
    console.log("Getting all conversations...");

    const response = await axios.get(
      "http://localhost:3000/jconnect/api/v1/users/allConvo?sort=-updatedAt",
      { withCredentials: true }
    );

    console.log("CONVERSATION LIST:");
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
}

export async function getAllUserMessages(convoId) {
  console.log("Getting user messages...");

  // Retrieve messages by the order of creation
  try {
    const response = await axios.get(
      `http://localhost:3000/jconnect/api/v1/conversation/${convoId}/message?sort=createdAt`,
      { withCredentials: true }
    );

    console.log("The response:", response.data.data);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function sendMessage(message, convoId) {
  const response = await axios.post();
}
