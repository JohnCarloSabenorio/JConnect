import axios from "axios";

export async function reactToMessage(messageId, emojiUnified) {
  try {
    const response = await axios.post(
      `jconnect/api/v1/message/react-to-message/${messageId}`,
      { unified: emojiUnified },
      { withCredentials: true }
    );
    console.log("MESSAGE ID:", messageId);
    console.log("UNIFIED EMOJI:", emojiUnified);
    return response.data.reactions;
  } catch (err) {
    console.log("Failed to react to message:", err);
  }
}

export async function unreactToMessage(messageId) {
  try {
    const response = axios.post(
      `jconnect/api/v1/message/unreact-to-message/${messageId}`,
      { unified: emojiUnified },
      { withCredentials: true }
    );

    console.log("REACTED TO MESSAGE:", response);
  } catch (err) {
    console.log("Failed to react to message:", err);
  }
}

export async function getTopEmojis(messageId) {
  const response = await axios.get(
    `jconnect/api/v1/message/get-top-emojis/${messageId}`
  );
  return response.data.reactions;
}
export async function getAllMessageReactions(messageId) {
  try {
    const response = await axios.get(
      `jconnect/api/v1/message/get-all-reactions/${messageId}`
    );

    return response.data.reactions;
  } catch (err) {
    console.log("Failed to retrieve all message reactions:", err);
  }
}
