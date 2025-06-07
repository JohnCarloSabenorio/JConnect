const mongoose = require("mongoose");

// Create Schema
notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    notification_type: {
      type: [String],
      required: true,
      default: [
        "message",
        "fr_accepted",
        "fr_received",
        "mention",
        "group_invite",
        "reaction",
      ],
    },
    seen: { type: Boolean, default: false },
    conversation_id: { type: mongoose.Schema.Types.ObjectId },
    friend_id: { type: mongoose.Schema.Types.ObjectId },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

// Document Middlewares

// Query Middlewares

// Aggregation Middlewares

// Methods
notificationModel = mongoose.model("Notification", notificationSchema);
module.exports = notificationModel;
