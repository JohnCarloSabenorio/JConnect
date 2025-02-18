const Message = require("./../models/messageModel");

exports.sendMessage = async (io, socket, data) => {
  // Data should have the: message, sender id, and conversation id
  const newMessage = await Message.create(data);
  const populatedMessage = await Message.findById(newMessage._id).populate(
    "sender"
  );
  io.emit("chat message", populatedMessage);
};
