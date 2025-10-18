import axios from "axios";

export async function getAllConversations() {
  try {
    const response = await axios.get(
      "https://jconnect-server.onrender.com/api/v1/user-conversation?isGroup=false&status=active&status=pending&status=muted&status=blocked&sort=updatedAt",
      { withCredentials: true }
    );

    const allDirects = response.data.data;

    return allDirects;
  } catch (error) {
    console.error("Error fetching direct conversations:", error);
  }
}

export async function getArchivedConversations() {
  try {
    const response = await axios.get(
      "https://jconnect-server.onrender.com/api/v1/user-conversation?status=archived",
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
    const response = await axios.get(
      "https://jconnect-server.onrender.com/api/v1/user-conversation?isGroup=true&status=active&status=pending&status=muted",
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
    // Create an api to get friend conversations
    const response = await axios.get(
      "https://jconnect-server.onrender.com/api/v1/friends/currentUser/allFriends",
      { withCredentials: true }
    );

    return response.data.data;
  } catch (err) {
    console.error("Error fetching user conversations:", err);
  }
}

export async function getAllUserMessages(convoId) {
  // Retrieve messages by the order of creation
  try {
    // Gets the conversation of the user
    const response = await axios.get(
      `https://jconnect-server.onrender.com/api/v1/conversation/${convoId}/message?sort=createdAt`,
      { withCredentials: true }
    );

    return response.data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function updateConversation(convoId, formData) {
  try {
    const response = await axios.patch(
      `https://jconnect-server.onrender.com/api/v1/conversation/${convoId}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const responseData = response.data;

    return responseData.data;
  } catch (err) {
    console.log("error in updating conversation:", err);
  }
}

export async function createConversation(
  users,
  isGroup,
  conversationName,
  convoImage
) {
  try {
    const formData = new FormData();

    users.forEach((user) => formData.append("users", user));
    formData.append("isGroup", String(isGroup));
    formData.append("conversationName", conversationName);

    if (convoImage) {
      formData.append("convoImage", convoImage);
    }

    const response = await axios.post(
      `https://jconnect-server.onrender.com/api/v1/conversation`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

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
      `https://jconnect-server.onrender.com/api/v1/user-conversation/get-convo-with-user/${userId}`,
      {
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (err) {
    console.log("Failed to find conversation with user:", err);
  }
}

export async function convoIsArchived(convoId) {
  try {
    const response = await axios.get(
      `https://jconnect-server.onrender.com/api/v1/conversation/userConvo/isArchived/${convoId}`,
      {
        withCredentials: true,
      }
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
      `https://jconnect-server.onrender.com/api/v1/user-conversation/${convoId}`,
      {
        withCredentials: true,
      }
    );

    const responseData = response.data;
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}

export async function updateUserConversation(userConvoId, newData) {
  try {
    const response = await axios.patch(
      `https://jconnect-server.onrender.com/api/v1/user-conversation/${userConvoId}`,
      newData,
      {
        withCredentials: true,
      }
    );

    if (!response.status === 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = response.data;

    return responseData.data;
  } catch (err) {
    console.log("Failed to update conversation:", err);
  }
}

export async function archiveConversation(convoId) {
  try {
    const response = await axios.patch(
      `https://jconnect-server.onrender.com/api/v1/conversation/userConvo/archive/${convoId}`,
      {
        withCredentials: true,
      }
    );

    if (!response.status === 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = response.data;
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}
export async function blockConversation(convoId) {
  try {
    const response = await axios.patch(
      `https://jconnect-server.onrender.com/api/v1/user-conversation/block/${convoId}`,
      {
        withCredentials: true,
      }
    );

    if (!response.status === 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.data;
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}

export async function unarchiveConversation(convoId) {
  try {
    const response = await axios.patch(
      `https://jconnect-server.onrender.com/api/v1/user-conversation/unarchive/${convoId}`,
      {
        withCredentials: true,
      }
    );

    if (!response.status === 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = response.data;
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}
export async function unblockConversation(convoId) {
  try {
    const response = await axios.patch(
      `https://jconnect-server.onrender.com/api/v1/user-conversation/unblock/${convoId}`,
      {
        withCredentials: true,
      }
    );

    if (!response.status === 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.data;
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}

export async function activateUserConversation(userConvoId) {
  try {
    const response = await axios.patch(
      `https://jconnect-server.onrender.com/api/v1/user-conversation/activate/${userConvoId}`,
      {
        withCredentials: true,
      }
    );

    if (!response.status === 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = response.data;
  } catch (err) {
    console.log("Error activating user conversation:", err);
  }
}

export async function leaveConversation(userConvoId) {
  try {
    const response = await axios.delete(
      `https://jconnect-server.onrender.com/api/v1/user-conversation/${userConvoId}`,
      {
        withCredentials: true,
      }
    );

    if (!response.status === 204) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error leaving conversation:", err);
  }
}

export async function addNewMembersToGroup(conversationId, newMembersId) {
  try {
    const response = await axios.post(
      `https://jconnect-server.onrender.com/api/v1/conversation/add-many/${conversationId}`,
      { newUsers: newMembersId },
      { withCredentials: true }
    );

    return response.data.updatedUsers;
  } catch (err) {
    console.log("Failed to add new members in the conversation:", err);
  }
}

export async function removeMemberFromGroup(conversationId, userId) {
  try {
    const response = await axios.delete(
      `
      https://jconnect-server.onrender.com/api/v1/users/${userId}/conversation/member/${conversationId}`,
      {
        withCredentials: true,
      }
    );
  } catch (err) {
    console.log("Failed to remove user from conversation:", err);
  }
}

export async function getNamesAndNicknames(convoId) {
  try {
    const response = await axios.get(
      `https://jconnect-server.onrender.com/api/v1/user-conversation/get-names-nicknames/${convoId}`,
      {
        withCredentials: true,
      }
    );

    const responseData = response.data;
    return responseData.userConversations;
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}

export async function findMutualGroupChats(userId) {
  try {
    const response = await axios.get(
      `https://jconnect-server.onrender.com/api/v1/conversation/mutual-gc/${userId}`,
      {
        withCredentials: true,
      }
    );

    return response.data.mutualConversations;
  } catch (err) {
    // console.log("Failed to check if conversation is archived: ", err);
  }
}
