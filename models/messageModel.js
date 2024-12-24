const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({});

const messageModel = mongoose.model("message", messageSchema);
module.exports = messageModel;
