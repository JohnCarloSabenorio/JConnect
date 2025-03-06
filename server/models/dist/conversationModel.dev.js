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
  convoName: {
    type: String,
    "default": "New Conversation"
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
  }
}, {
  timestamps: true
}); // DOCUMENT MIDDLEWARES
// QUERY MIDDLEWARES

convoSchema.pre(/^find/, function (next) {
  this.populate({
    path: "users"
  });
  next();
});
var ConvoModel = mongoose.model("Conversation", convoSchema);
module.exports = ConvoModel;