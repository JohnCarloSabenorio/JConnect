import axios from "axios";

export async function getAllUserConversation() {
  try {
    console.log("Getting all conversations...");

    const response = await axios.get(
      "http://localhost:3000/jconnect/api/v1/users/allConvo",
      { withCredentials: true }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
}

export async function getAllUserMessages(convoId) {
  console.log("Getting user messages...");

  try {
    const response = await axios.get(
      `http://localhost:3000/jconnect/api/v1/conversation/${convoId}/message`,
      { withCredentials: true }
    );

    console.log("The response:", response.data.data);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
}
