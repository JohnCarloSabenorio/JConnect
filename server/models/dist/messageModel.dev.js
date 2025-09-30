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
    "enum": ["message", "remove_member", "add_member", "update_chat_name", "change_emoji", "change_nickname", "change_photo"],
    "default": "message"
  },
  images: [String],
  files: [{
    originalname: {
      type: String,
      required: true
    },
    storagename: {
      type: String,
      required: true
    }
  }],
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true
  }
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
}); // Virtual Properties

messageSchema.virtual("imageUrls").get(function () {
  // Check if there is no images property
  if (!this.images) return null;
  var imageUrls = this.images.map(function (img) {
    if (img.startsWith("img/sentImages")) {
      return img;
    } else {
      return "img/sentImages/".concat(img);
    }
  });
  return imageUrls;
});
messageSchema.virtual("fileUrls").get(function () {
  // Check if there is no images property
  if (!this.files) return null;
  var fileUrls = this.files.map(function (file) {
    if (file.storagename.startsWith("files/sentFiles")) {
      return file;
    } else {
      return {
        originalname: file.originalname,
        storagename: "files/sentFiles/".concat(file.storagename)
      };
    }
  });
  return fileUrls;
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