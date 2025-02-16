const mongoose = require("mongoose");
const { trim } = require("validator");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["deleted", "sent", "updated", "forwarded"],
      select: false,
    },
    images: [String],
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Document Middlewares

// Query Middlewares

// Methods

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sender",
  });

  next();
});
const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
