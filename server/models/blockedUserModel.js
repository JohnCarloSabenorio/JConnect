const mongoose = require("mongoose");

// REMOVE THIS SCHEMA

const blockedUserSchema = mongoose.Schema(
  {
    blocker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blocked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// This makes sure that the combinations of two users are unique
blockedUserSchema.index({ blocker: 1, blocked: 1 }, { unique: true });

// QUERY MIDDLEWARE

// Populates the friend and user fields
blockedUserSchema.pre(/^find/, function (next) {
  this.populate({
    path: "blocker blocked",
  });

  next();
});

const blockedUser = mongoose.model("BlockedUser", blockedUserSchema);

module.exports = blockedUser;
