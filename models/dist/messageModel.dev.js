"use strict";

var mongoose = require("mongoose");

var _require = require("validator"),
    trim = _require.trim;

var messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    "enum": ["deleted", "sent", "updated", "forwarded"],
    select: false
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true
}); // Document Middlewares
// Query Middlewares
// Methods

var messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;