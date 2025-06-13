"use strict";

var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
  message: {
    type: String,
    "default": ""
  },
  mentions: {
    type: Map,
    "default": {}
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    "enum": ["deleted", "sent", "updated", "forwarded"],
    select: false
  },
  images: [String],
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
}); // Document Middlewares
// Query Middlewares

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sender"
  });
  next();
}); // Methods

var messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;