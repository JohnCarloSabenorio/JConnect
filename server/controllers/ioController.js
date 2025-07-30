const Message = require("./../models/messageModel");
const Conversation = require("../models/conversationModel");
const Notification = require("../models/notificationModel");
const UserConversation = require("../models/userConversationModel");
const sharp = require("sharp"); // For saving and manipulating images
const fs = require("fs");
const path = require("path");

exports.inviteToGroupChat = async (io, socket, data) => {
  console.log("inviting user to the group chat!");
  const userConversation = await UserConversation.findOne({
    user: data.user,
    conversation: data.conversation,
  });
  console.log("invited user to conversation:", data.conversation);
  if (!userConversation) {
    console.log("there is no existing user conversation!");
    return;
  }

  console.log("THE DATA USER:", data.user);

  io.to(`user_${data.user}`).emit("invite groupchat", { userConversation });
};

exports.sendMessage = async (io, socket, data) => {
  // 1. Find the message created in the db
  const newMessage = await Message.findById(data.messageId)
    .populate("sender")
    .populate("mentions");

  console.log("new message:", newMessage);
  // Remove this in the future (Images should be sent in db not via socket)

  // 2. Create filenames for sent images
  if (data.images.length > 0) {
    console.log("filenames exist!");
    const filenames = await Promise.all(
      data.images.map(async (img, idx) => {
        const buffer = Buffer.from(img);
        const filename = `image-${
          newMessage.sender._id
        }-${Date.now()}-${idx}.jpeg`;

        await sharp(buffer)
          .resize(800)
          .toFormat("jpeg")
          .jpeg({ quality: 70 })
          .toFile(`public/img/sentImages/${filename}`);
        return filename;
      })
    );

    newMessage.images = filenames;
    await newMessage.save();
    console.log("Array of image file names:", filenames);
  }

  // 3. Update the user conversation
  const updatedUserConversation = await UserConversation.findOne({
    user: newMessage.sender._id,
    conversation: newMessage.conversation,
  });

  console.log("updated user conversation:", updatedUserConversation);

  // 4. Convert images to base64 (This is not recommended.. Change this)
  const imageBase64Array = await Promise.all(
    newMessage.images.map(async (filename) => {
      const imagePath = path.join("public/img/sentImages", filename);
      const buffer = await sharp(imagePath).toBuffer();
      return `data:image/jpeg;base64,${buffer.toString("base64")}`;
    })
  );

  const messageObject = {
    ...newMessage.toObject(),
    images64: imageBase64Array,
  };

  io.to(newMessage.conversation.toString()).emit("chat message", {
    msg: messageObject,
    convo: updatedUserConversation.conversation,
    isGroup: updatedUserConversation.isGroup,
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
    (reaction) => reaction.user._id.toString() == data.userId.toString()
  );

  // Find the index of the existing user reaction
  const reactionIdx = messageReactions.findIndex(
    (reaction) => reaction.user._id.toString() == data.userId.toString()
  );

  // console.log("the user reaction: ", existingUserReaction);
  // console.log(reactionIdx);

  if (existingUserReaction) {
    // If the user reacted to the message, check if the unified emoji is the same
    if (existingUserReaction.unified == data.emojiUnified) {
      console.log("removed the reaction");
      // If it is, then remove the reaction
      messageReactions.splice(reactionIdx, 1);
    } else {
      console.log("replaced the reaction");
      // If not, then replace the unified emoji
      existingUserReaction.unified = data.emojiUnified;
      messageReactions[reactionIdx] = existingUserReaction;
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

  io.to(message.conversation._id.toString()).emit("message react", {
    reactions: messageReactions,
    message: message,
  });
};

exports.sendNotification = async (io, socket, data) => {
  // Create notification

  try {
    console.log("THE SEND NOTIF DATA:", data);

    let notificationData = {
      message: data.message,
      receiver: data.receiver,
      notification_type: data.notification_type,
      actor: data.actor,
      messageId: data.messageId ? data.messageId : undefined,
    };

    if (
      data.notification_type == "fr_received" ||
      data.notification_type == "fr_accepted"
    ) {
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
    }

    // Retrieve the "user convo" of the conversation

    let newNotification = await Notification.create(notificationData);

    console.log("THE USER CONVO IN NOTIF:", newNotification.userconversation);
    if (newNotification.userconversation) {
      newNotification = await newNotification.populate("userconversation");
    }
    console.log("the new notification:", newNotification);
    io.to(`user_${data.receiver}`).emit(
      "receive notification",
      newNotification
    );
  } catch (err) {
    console.log("Failed to create new notification:", err);
  }
  // Emit received notification to the target user
};
