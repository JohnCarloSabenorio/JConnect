const Message = require("./../models/messageModel");
const Conversation = require("../models/conversationModel");
exports.sendMessage = async (io, socket, data) => {
  // Data should have the: message, sender id, and conversation id
  const newMessage = await Message.create(data);
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

  console.log("updatedConvo data:", updatedConvo);
  io.emit("chat message", {
    msg: populatedMessage,
    convo: updatedConvo,
  });
};
