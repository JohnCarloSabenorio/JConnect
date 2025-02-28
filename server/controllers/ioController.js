const Message = require("./../models/messageModel");
const Conversation = require("../models/conversationModel");
const sharp = require("sharp"); // For saving and manipulating images
const fs = require("fs");
const path = require("path");
exports.sendMessage = async (io, socket, data) => {
  // Data should have the: message, sender id, and conversation id

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
    message: data.message ? data.message : "",
    sender: data.sender,
    conversation: data.conversation,
    images: filenames,
  });

  const populatedMessage = await Message.findById(newMessage._id).populate(
    "sender"
  );

  const updatedConvo = await Conversation.findByIdAndUpdate(
    data.conversation,
    {
      latestMessage: data.message,
    },
    { new: true }
  );

  const imageBase64Array = await Promise.all(
    populatedMessage.images.map(async (filename) => {
      const imagePath = path.join("public/img/sentImages", filename);

      console.log("THE IMAGE PATH:", imagePath);
      const buffer = await sharp(imagePath).toBuffer();
      return `data:image/jpeg;base64,${buffer.toString("base64")}`;
    })
  );

  console.log("IMAGE BUFFERIST:", imageBase64Array);

  const messageObject = populatedMessage.toObject();
  messageObject.images64 = imageBase64Array;

  console.log("POPPU WITH IMAGE64:", populatedMessage);

  io.to(data.conversation).emit("chat message", {
    msg: messageObject,
    convo: updatedConvo,
  });
};
