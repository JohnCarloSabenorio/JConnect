import axios from "axios";

export async function reactToMessage(messageId, emojiUnified) {
  try {
    const response = await axios.post(
      `https://jconnect-server.onrender.com/api/v1/message/react-to-message/${messageId}`,
      { unified: emojiUnified },
      { withCredentials: true }
    );

    return response.data.reactions;
  } catch (err) {
    console.log("Failed to react to message:", err);
  }
}

export async function unreactToMessage(messageId) {
  try {
    const response = axios.post(
      `https://jconnect-server.onrender.com/api/v1/message/unreact-to-message/${messageId}`,
      { unified: emojiUnified },
      { withCredentials: true }
    );
  } catch (err) {
    console.log("Failed to react to message:", err);
  }
}

export async function getTopEmojis(messageId) {
  const response = await axios.get(
    `https://jconnect-server.onrender.com/api/v1/message/get-top-emojis/${messageId}`
  );
  return response.data.reactions;
}
export async function getAllMessageReactions(messageId) {
  try {
    const response = await axios.get(
      `https://jconnect-server.onrender.com/api/v1/message/get-all-reactions/${messageId}`
    );

    return response.data.reactions;
  } catch (err) {
    console.log("Failed to retrieve all message reactions:", err);
  }
}

export async function createMessage(data) {
  try {
    const formData = new FormData();
    formData.append("message", data.message);
    formData.append("sender", data.sender);
    formData.append("conversation", data.conversation);
    formData.append("mentions", data.mentions);

    if (data.images) {
      data.images.forEach((img) => {
        formData.append("images", img);
      });
    }
    if (data.files) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await axios.post(
      "https://jconnect-server.onrender.com/api/v1/message",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (err) {
    console.log("Error creating a message:", err);
  }
}
