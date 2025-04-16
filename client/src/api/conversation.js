import axios from "axios";

export async function getDirectConversations() {
  try {
    // console.log("Getting all direct conversations...");

    const response = await axios.get(
      "/jconnect/api/v1/user-conversation?isGroup=false&status=active",
      { withCredentials: true }
    );

    const allDirects = response.data.data;

    console.log("ALL DIRECTS:", response.data);
    return allDirects;
  } catch (error) {
    console.error("Error fetching direct conversations:", error);
  }
}

export async function getArchivedConversations() {
  try {
    // console.log("Getting all archived conversations...");

    const response = await axios.get(
      "/jconnect/api/v1/user-conversation?status=archived",
      { withCredentials: true }
    );

    const allArchived = response.data.data;

    return allArchived;
  } catch (error) {
    console.error("Error fetching direct conversations:", error);
  }
}

export async function getAllGroupConversation() {
  try {
    // console.log("Getting all group conversations...");

    const response = await axios.get(
      "/jconnect/api/v1/user-conversation?isGroup=true&status=active",
      { withCredentials: true }
    );

    const allGroups = response.data.data;
    return allGroups;
  } catch (error) {
    console.error("Error fetching group conversations:", error);
  }
}

export async function getFriendsConversation() {
  try {
    // console.log("Getting friend conversations...");
    // Create an api to get friend conversations
    const response = await axios.get(
      "/jconnect/api/v1/friends/currentUser/allFriends",
      { withCredentials: true }
    );

    // console.log("FRIENDS CONVO:", response);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching user conversations:", err);
  }
}

export async function getAllUserMessages(convoId) {
  // console.log("Getting user messages...");

  // Retrieve messages by the order of creation
  try {
    // Gets the conversation of the user
    const response = await axios.get(
      `/jconnect/api/v1/conversation/${convoId}/message?sort=createdAt`,
      { withCredentials: true }
    );

    // console.log("THE RESPONSE DATA FOR USER MSESAGES", response);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function createConversation(userId, friendId) {
  // console.log("Creating conversation...");
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

    console.log("A CONVO HAS BEEN CREATED!", response);
    return response.data.data;
  } catch (err) {
    // console.log("Failed to chat with friend:", err);
  }
}

export async function findConvoWithUser(userId) {
  // Check if the user has an existing conversation with a f
  //
  // riend
  try {
    const response = await axios.get(
      `jconnect/api/v1/user-conversation/get-convo-with-user/${userId}`,
      {
        withCredentials: true,
      }
    );

    console.log(
      "THE USER CONVERSATION RECORD OF THE CURRENT:",
      response.data.data
    );

    return response.data.data;
  } catch (err) {
    console.log("Failed to find conversation with user:", err);
  }
}

export async function convoIsArchived(convoId) {
  try {
    const response = await axios.get(
      `jconnect/api/v1/conversation/userConvo/isArchived/${convoId}`
    );

    const responseData = response.data;
    return responseData.isArchived;
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}

// AFTER YOU GET BACK, UPDATE THE CHECKING WHETHER THE USER IS ARCHIVED OR NOT USING THE GETUSERCONVOSTATUS API
export async function getUserConversation(convoId) {
  try {
    const response = await axios.get(
      `jconnect/api/v1/user-conversation/${convoId}`
    );

    const responseData = response.data;
    // console.log(responseData);
    // return responseData.isArchived;
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}

export async function updateUserConversation(userConvoId, newData) {
  try {
    const response = await axios.post(
      `jconnect/api/v1/user-conversation/${userConvoId}`,
      newData,
      {
        withCredentials: true,
      }
    );

    if (!response.status === 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = response.data;

    // console.log("Updated user conversation response:", responseData);
  } catch (err) {
    // console.log("Failed to archive conversation");
  }
}

export async function archiveConversation(convoId) {
  try {
    const response = await axios.patch(
      `jconnect/api/v1/conversation/userConvo/archive/${convoId}`
    );

    if (!response.status === 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = response.data;
    // console.log("CONVERSATION ARCHIVED SUCCESSFULLY!", responseData);
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}
export async function unarchiveConversation(convoId) {
  try {
    const response = await axios.patch(
      `jconnect/api/v1/user-conversation/unarchive/${convoId}`
    );

    if (!response.status === 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = response.data;
    console.log("CONVERSATION UNARCHIVED!", responseData);
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}
