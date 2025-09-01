const mongoose = require("mongoose");
const { bool } = require("sharp");

const userConvoSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nickname: { type: String },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  conversationName: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "pending", "archived", "muted"],
    default: "active",
  },

  role: {
    type: String,
    enum: ["owner", "admin", "member"],
    default: "member",
  },

  isGroup: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Document middleware

// Query middleware
userConvoSchema.pre(/^find/, function (next) {
  this.populate({
    path: "conversation",
  });
  next();
});

// This makes sure that the combinations of the user and conversation are unique
userConvoSchema.index({ user: 1, conversation: 1 }, { unique: true });

// Export conversation model
const userConvoModel = mongoose.model("UserConversation", userConvoSchema);

module.exports = userConvoModel;
