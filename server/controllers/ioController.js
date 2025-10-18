const Message = require("./../models/messageModel");
const Conversation = require("../models/conversationModel");
const Notification = require("../models/notificationModel");
const UserConversation = require("../models/userConversationModel");
const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");

exports.changeUserStatus = async (io, socket, data) => {
  console.log("changing user status...");
  const updatedUser = await User.findByIdAndUpdate(
    data.actor,
    {
      status: data.status,
    },
    { new: true }
  );

  if (!updatedUser) {
    return;
  }
  console.log("after status update:", updatedUser);

  io.emit("change status", {
    updatedUser,
  });
};

exports.updateNickname = async (io, socket, data) => {
  console.log("update nickname data:", data);

  if (!data.activeConvoIsGroup) {
    // Find the user conversations for the current conversation
    const userConversations = await UserConversation.find({
      conversation: data.conversationId,
    });

    const userConvoIds = [userConversations[0]._id, userConversations[1]._id];

    console.log("user convo ids:", userConvoIds);

    const update1 = {};
    const update2 = {};

    if (userConvoIds[0].toString() == data.userConvoId) {
      update1.nickname = data.newNickname;
    } else {
      update1.conversationName = data.newNickname;
    }
    if (userConvoIds[1].toString() == data.userConvoId) {
      update2.nickname = data.newNickname;
    } else {
      update2.conversationName = data.newNickname;
    }

    const updateUserConvo1 = await UserConversation.findByIdAndUpdate(
      userConvoIds[0],
      { $set: update1 },
      { new: true }
    ).populate("conversation user");
    const updateUserConvo2 = await UserConversation.findByIdAndUpdate(
      userConvoIds[1],
      { $set: update2 },
      { new: true }
    ).populate("conversation user");

    // Update the user convo of the other user

    io.to(data.conversationId.toString()).emit("update nickname", {
      userConvoId: data.userConvoId,
      newNickname: data.newNickname,
      isGroup: false,
      updateUserConvo1: updateUserConvo1.toObject({ virtuals: true }),
      updateUserConvo2: updateUserConvo2.toObject({ virtuals: true }),
    });
  } else {
    const updatedUserConversation = await UserConversation.findByIdAndUpdate(
      data.userConvoId,

      { nickname: data.newNickname },
      {
        new: true,
        runValidators: true,
      }
    );

    // Update the conversation name of the active user convo

    io.to(data.conversationId.toString()).emit("update nickname", {
      userConvoId: data.userConvoId,
      newNickname: updatedUserConversation.nickname,
      isGroup: updatedUserConversation.isGroup,
      convoId: updatedUserConversation.conversation._id,
    });
  }
};

exports.updateConversation = async (io, socket, data) => {
  console.log("data data:", data.data);
  const updatedConversation = await Conversation.findByIdAndUpdate(
    data.conversationId,
    data.data,
    { new: true }
  );

  if (!updatedConversation) {
    console.log("No conversation has been updated!");
    console.log("Please check the data sent to the controller:", data);
    return;
  }

  // MAKE A CREATE MESSAGE FUNCTION IF A MESSAGE IS PRESENT IN UPDATE CONVERSATION

  let updateConvoObject = updatedConversation.toObject({ virtuals: true });

  let resultData = { updatedConversation: updateConvoObject };

  if (data.message) {
    const newMessage = await Message.create({
      message: data.message,
      conversation: data.conversationId,
      sender: data.actor,
      action: data.action,
    });

    const populatedMessage = await newMessage.populate("sender");

    resultData.messageData = populatedMessage.toObject({ virtuals: true });
  }

  io.to(data.conversationId.toString()).emit("update conversation", resultData);
};

exports.createMessage = async (io, socket, data) => {
  const convo = await Conversation.findByIdAndUpdate(
    data.conversationId,
    {
      latestMessage: data.message,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const newMessage = await Message.create({
    message: data.message,
    conversation: data.conversationId,
    sender: data.actor,
    action: data.action,
  });

  const populatedMessage = await newMessage.populate("sender");

  console.log("the populated message here:", populatedMessage);
  io.to(data.conversationId.toString()).emit("create message", {
    userId: data.member._id ? data.member._id : data.actor,
    messageData: populatedMessage,
    conversationData: convo,
  });
};

exports.removeMember = async (io, socket, data) => {
  // Remove the user from the conversation
  let convo = await Conversation.findByIdAndUpdate(
    data.conversationId,
    {
      $pull: {
        users: data.member._id,
      },
      latestMessage: `${data.member.username} has been removed from the group.`,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Remove the user conversation data of the user
  await UserConversation.findOneAndDelete({
    conversation: data.conversationId,
    user: data.member._id,
  });

  // Turn the convo to an object to include virtual data

  convo = convo.toObject({ virtuals: true });
  // Emit remove member to the conversation
  io.to(data.conversationId.toString()).emit("remove member", {
    userId: data.member._id,
    conversationData: convo,
  });
};

exports.chatAUser = async (io, socket, data) => {
  // Find the user conversation
  let userConversation = await UserConversation.findOne({
    user: data.user,
    conversation: data.conversation,
  });

  userConversation = userConversation.toObject({ virtual: true });
  if (!userConversation) {
    console.log("there is no existing user conversation!");
    return;
  }

  console.log("chatting a user data:", userConversation);
  console.log("the users:", userConversation.conversation.users);
  io.to(`user_${data.user}`).emit("chat user", {
    userId: data.user,
    userConversation,
  });
};

exports.leaveConversation = async (io, socket, data) => {
  // Find the conversation
  let userConversation = await UserConversation.findById(data.userConvoId);

  console.log("the user convo to be deleted:", userConversation);

  let conversation = await Conversation.findByIdAndUpdate(
    userConversation.conversation,
    { $pull: { users: data.user._id } },
    { new: true }
  );

  if (!userConversation) {
    console.log("there is no existing user conversation!");
    return;
  }

  await userConversation.deleteOne();

  // Create a message that says the user left the group
  const newMessage = await Message.create({
    message: `${data.user.username} left the group.`,
    conversation: conversation._id,
    sender: data.actor,
    action: "remove_member",
  });

  const populatedMessage = await newMessage.populate("sender");

  convoObject = conversation.toObject({ virtuals: true });
  console.log("leaving the group success!");

  convoObject.users.forEach((user) => {
    io.to(`user_${user._id.toString()}`).emit("leave group", {
      updatedConversation: convoObject,
      removedUserId: data.user._id,
      messageData: populatedMessage.toObject({ virtuals: true }),
    });
  });
};

exports.inviteToGroupChat = async (io, socket, data) => {
  let userConversation = await UserConversation.findOne({
    user: data.user,
    conversation: data.conversation,
  });
  if (!userConversation) {
    console.log("there is no existing user conversation!");
    return;
  }

  userConversation = userConversation.toObject({ virtuals: true });
  console.log("THE DATA USER:", data.user);

  io.to(`user_${data.user}`).emit("invite groupchat", {
    userId: data.user,
    userConversation,
  });
};

exports.sendMessage = async (io, socket, data) => {
  // 1. Find the message created in the db
  const newMessage = await Message.findById(data.messageId)
    .populate("sender")
    .populate("mentions");

  console.log("new message:", newMessage);

  // 3. Update the user conversation
  const updatedUserConversation = await UserConversation.findOne({
    user: newMessage.sender._id,
    conversation: newMessage.conversation,
  });

  const messageObject = {
    ...newMessage.toObject(),
  };

  const updatedUserConvoObject = updatedUserConversation.toObject({
    virtuals: true,
  });

  io.to(newMessage.conversation.toString()).emit("chat message", {
    msg: messageObject,
    convo: updatedUserConvoObject.conversation,
    isGroup: updatedUserConvoObject.isGroup,
    // conversation
    // latest message
  });
};

exports.reactToMesage = async (io, socket, data) => {
  // console.log("reaction data:", data);
  // 1. Find the message
  const message = await Message.findById(data.messageId);

  console.log("the message:", message);
  if (!message) {
    return;
  }

  // Extract the message reactions
  const messageReactions = message.reactions;

  // Check if the user already reacted to the message

  const existingUserReaction = messageReactions.find(
    (reaction) => reaction.user._id.toString() == data.actor.toString()
  );

  // Find the index of the existing user reaction
  const reactionIdx = messageReactions.findIndex(
    (reaction) => reaction.user._id.toString() == data.actor.toString()
  );

  // console.log("the user reaction: ", existingUserReaction);
  // console.log(reactionIdx);

  if (existingUserReaction) {
    // If the user reacted to the message, check if the unified emoji is the same
    if (existingUserReaction.unified == data.emojiUnified) {
      console.log("removed the reaction");
      // If it is, then remove the reaction
      messageReactions.splice(reactionIdx, 1);

      // This will remove the notification if the receiver is not online

      const theReceiver = await User.findById(data.receiver);

      console.log("the receiver:", theReceiver);
      // NEED TESTING

      if (theReceiver.status != "online") {
        console.log("THE RECEIVER IS NOT ONLINE!");
        const deleteNotif = await Notification.findOneAndDelete({
          actor: data.actor,
          messageId: data.messageId,
          receiver: data.receiver,
          notification_type: "reaction",
        });
        console.log("deleted!");
      }
    } else {
      console.log("replaced the reaction");
      // If not, then replace the unified emoji
      existingUserReaction.unified = data.emojiUnified;
      messageReactions[reactionIdx] = existingUserReaction;

      // This will update the notification if the receiver is not online
      // NEED TESTING
      const existingNotification = await Notification.findOneAndUpdate(
        {
          actor: data.actor,
          messageId: data.messageId,
          conversation: data.conversation,
          receiver: data.receiver,
          notification_type: "reaction",
        },
        { message: data.notifMessage }
      );
    }
  } else {
    // If there is no existing user reaction, create one
    console.log("added new user reaction");
    messageReactions.push({
      user: data.userId,
      unified: data.emojiUnified,
    });

    message.reactions = messageReactions;
  }

  await message.save();

  let messageObj = message.toObject({ virtuals: true });
  io.to(message.conversation._id.toString()).emit("message react", {
    reactions: messageReactions,
    message: messageObj,
  });
};

exports.sendNotification = async (io, socket, data) => {
  // Create notification
  let isMuted = false;
  try {
    let notificationData = {
      message: data.message,
      receiver: data.receiver,
      notification_type: data.notification_type,
      actor: data.actor,
      // messageId: data.messageId ? data.messageId : undefined,
    };

    if (
      data.notification_type == "fr_received" ||
      data.notification_type == "fr_accepted"
    ) {
      console.log("sending friend request...");
      const existingNotification = await Notification.findOne({
        receiver: data.receiver,
        notification_type: data.notification_type,
        actor: data.actor,
      });

      console.log("the existing notif:", existingNotification);

      if (existingNotification) {
        existingNotification.updatedAt = Date.now();
        existingNotification.seen = false;
        await existingNotification.save();
        return;
      }
    } else if (
      data.notification_type == "group_invite" ||
      data.notification_type == "mention" ||
      data.notification_type == "reaction"
    ) {
      const userConversation = await UserConversation.findOne({
        user: data.receiver,
        conversation: data.conversation,
      });

      // Check if there is an existing reaction notification
      if (data.notification_type == "reaction") {
        const existingNotification = await Notification.findOne({
          receiver: data.receiver,
          notification_type: data.notification_type,
          actor: data.actor,
          messageId: data.messageId,
        });

        // Update the notification instead of creating one
        if (existingNotification) {
          existingNotification.updatedAt = Date.now();
          existingNotification.seen = false;
          existingNotification.message = data.message;
          await existingNotification.save();
          return;
        }
      }

      notificationData["userconversation"] = userConversation._id;

      console.log("the user conversation:", userConversation);
      isMuted = userConversation.status == "muted";
    }

    // Retrieve the "user convo" of the conversation

    let newNotification = await Notification.create(notificationData);

    if (newNotification.userconversation) {
      newNotification = await newNotification.populate("userconversation");
    }
    newNotification = await newNotification.populate("actor");
    newNotification = newNotification.toObject({ virtuals: true });

    console.log("new notification data:", {
      ...newNotification,
      isMuted: isMuted,
    });

    io.to(`user_${data.receiver}`).emit("receive notification", {
      ...newNotification,
      isMuted: isMuted,
    });
  } catch (err) {
    console.log("Failed to create new notification:", err);
  }
  // Emit received notification to the target user
};
