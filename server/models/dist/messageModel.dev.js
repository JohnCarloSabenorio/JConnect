"use strict";

var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
  message: {
    type: String,
    "default": ""
  },
  reactions: {
    type: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      unified: {
        type: String,
        required: true
      }
    }]
  },

  /* 
  unified: string,
  user: mongoose.Schema.Types.ObjectId,
  */
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
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
  action: {
    type: String,
    "enum": ["message", "remove_member", "add_member", "update_chat_name"],
    "default": "message"
  },
  images: [String],
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true
  }
}, {
  timestamps: true
}); // Document Middlewares
// Query Middlewares

messageSchema.pre(/^find/, function (next) {
  this.populate([{
    path: "sender"
  }, {
    path: "mentions"
  }, {
    path: "reactions.user"
  }]);
  next();
}); // Methods

var messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;