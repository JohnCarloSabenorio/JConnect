const mongoose = require("mongoose");

// Create Schema
notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId },
    notification_type: {
      type: [String],
      required: true,
      enum: {
        values: [
          "fr_accepted",
          "fr_received",
          "mention",
          "group_invite",
          "reaction",
        ],
        message:
          "{VALUE} is not a valid notification type. The available statuses are: fr_accepted, fr_receieved, mention, group_invite, and reaction.",
      },
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
