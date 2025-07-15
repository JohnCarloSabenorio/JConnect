const Message = require("./../models/messageModel");
const Conversation = require("../models/conversationModel");
const Notification = require("../models/notificationModel");
const UserConversation = require("../models/userConversationModel");
const sharp = require("sharp"); // For saving and manipulating images
const fs = require("fs");
const path = require("path");
exports.sendMessage = async (io, socket, data) => {
  // Data should have the: message, sender id, and conversation id

  console.log("Sent data:", data);
  // Remove this in the future (Images should be sent in db not via socket)
  const filenames = await Promise.all(
    data.images.map(async (img, idx) => {
      console.log("THE IMAGE BRO:", img);
      const buffer = Buffer.from(img);

      console.log("THE BUFFER:", buffer);

      const filename = `image-${data.sender}-${Date.now()}-${idx}.jpeg`;

      await sharp(buffer)
        .resize(800)
        .toFormat("jpeg")
        .jpeg({ quality: 70 })
        .toFile(`public/img/sentImages/${filename}`);

      console.log("IMAGE BUFFER:", buffer);
      return filename; // Return filename to collect in array
    })
  );

  console.log("THE ARRAY FILENAME:", filenames);

  const newMessage = await Message.create({
    message: data.message || "",
    sender: data.sender,
    conversation: data.conversation,
    images: filenames,
    mentions: data.mentions,
  });

  // 2. Update the conversation AND get the updated version in one step
  const [populatedMessage, updatedConvo, userConversation] = await Promise.all([
    Message.findById(newMessage._id).populate("sender").populate("mentions"), // populate sender
    Conversation.findByIdAndUpdate(
      data.conversation,
      { latestMessage: data.latestMessage },
      { new: true }
    ),
    UserConversation.findOne({
      user: data.sender,
      conversation: data.conversation,
    }),
  ]);

  console.log("The user conversation of the sent message:", userConversation);

  const imageBase64Array = await Promise.all(
    populatedMessage.images.map(async (filename) => {
      const imagePath = path.join("public/img/sentImages", filename);

      // console.log("THE IMAGE PATH:", imagePath);
      const buffer = await sharp(imagePath).toBuffer();
      return `data:image/jpeg;base64,${buffer.toString("base64")}`;
    })
  );

  console.log("IMAGE BUFFERIST:", imageBase64Array);

  const messageObject = populatedMessage.toObject();
  messageObject.images64 = imageBase64Array;

  console.log("SENDING MESSAGE TO ROOM:", userConversation._id.toString());

  io.to(userConversation.conversation._id.toString()).emit("chat message", {
    msg: messageObject,
    convo: userConversation,
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
    }
    // Retrieve the "user convo" of the conversation
    if (data.notification_type == "group_invite") {
      const userConversation = await UserConversation.findOne({
        
      });
    }
    const newNotification = await Notification.create(data);

    console.log("new notification created:", newNotification);
    io.to(`user_${data.receiver}`).emit(
      "receive notification",
      newNotification
    );
  } catch (err) {
    console.log("Failed to create new notification:", err);
  }
  // Emit received notification to the target user
};
