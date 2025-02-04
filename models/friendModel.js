const mongoose = require("mongoose");

const friendSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "blocked"],
        message:
          "{VALUE} is not a valid status. The available statuses are: pending, accepted, and blocked.",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

friendSchema.index({ user: 1, friend: 1 }, { unique: true });

// QUERY MIDDLEWARE

// Populates the friend and user fields
// friendSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "friend user",
//   });

//   next();
// });

const friend = mongoose.model("Friend", friendSchema);

module.exports = friend;
