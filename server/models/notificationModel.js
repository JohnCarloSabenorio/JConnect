const mongoose = require("mongoose");

// Create Schema
notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notification_type: {
      type: String,
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
    conversation: { type: mongoose.Schema.Types.ObjectId },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

notificationSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "actor",
    },
    {
      path: "receiver",
    },
  ]);
  next();
});

// Document Middlewares

// Query Middlewares

// Aggregation Middlewares

// Methods
notificationModel = mongoose.model("Notification", notificationSchema);
module.exports = notificationModel;
