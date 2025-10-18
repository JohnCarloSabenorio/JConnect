"use strict";

var mongoose = require("mongoose");

var validator = require("validator");

var convoSchema = new mongoose.Schema({
  // If user.length > 2, it is a group, if not it is a 1 to 1 convo
  users: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }],
    validate: {
      validator: function validator(arr) {
        return arr.length >= 2 && arr.length <= 10;
      },
      message: "{PATH} must be between 2 and 10 users"
    }
  },
  conversationName: {
    type: String,
    "default": "New Conversation"
  },
  isGroup: {
    type: Boolean,
    "default": false
  },
  convoImage: {
    type: String,
    "default": "default-gc.png"
  },
  status: {
    type: String,
    "enum": {
      values: ["active", "archived"]
    }
  },
  latestMessage: {
    type: String,
    "default": ""
  },
  unifiedEmoji: {
    type: String,
    "default": "1f44d"
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}); // Virtual Properties

convoSchema.virtual("gcImageUrl").get(function () {
  if (!this.convoImage) return null;
  if (this.convoImage.startsWith("img/convoImages")) return this.convoImage;
  return process.env.NODE_ENV === "production" ? "https://jconnect-server.onrender.com/img/gcImages/".concat(this.convoImage) : "img/gcImages/".concat(this.convoImage);
}); // DOCUMENT MIDDLEWARES

convoSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function (next) {
  this.set({
    updatedAt: new Date()
  });
  next();
}); // QUERY MIDDLEWARES

convoSchema.pre(/^find/, function (next) {
  this.populate({
    path: "users"
  });
  next();
});
var ConvoModel = mongoose.model("Conversation", convoSchema);
module.exports = ConvoModel;