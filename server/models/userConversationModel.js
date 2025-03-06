const mongoose = require("mongoose");
const { bool } = require("sharp");

// Create conversation schema

const userConvoSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "archived", "muted"],
    default: "active",
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

userConvoSchema.virt;

// This makes sure that the combinations of the user and conversation are unique
userConvoSchema.index({ user: 1, conversation: 1 }, { unique: true });

// Export conversation model
const userConvoModel = mongoose.model("UserConversation", userConvoSchema);

module.exports = userConvoModel;
