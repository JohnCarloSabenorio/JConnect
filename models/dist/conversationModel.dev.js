"use strict";

var mongoose = require("mongoose");

var validator = require("validator");

var convoSchema = new mongoose.Schema({
  // If user.length > 2, it is a group, if not it is a 1 to 1 convo
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: function validator(arr) {
        arr.length >= 2 && arr.length <= 10;
      },
      message: "{PATH} must be between 2 and 10 users"
    }
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  convoName: {
    type: String
  },
  convoImage: {
    type: String
  }
}, {
  timestamps: true
});
var ConvoModel = mongoose.model("Conversation", convoSchema);
module.exports = ConvoModel;