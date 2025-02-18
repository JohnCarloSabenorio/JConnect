"use strict";

var mongoose = require("mongoose");

var friendSchema = mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    "enum": {
      values: ["pending", "accepted", "blocked"],
      message: "{VALUE} is not a valid status. The available statuses are: pending, accepted, and blocked."
    },
    "default": "pending"
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}); // This makes sure that the combinations of two users are unique

friendSchema.index({
  user1: 1,
  user2: 1
}, {
  unique: true
}); // QUERY MIDDLEWARE
// Populates the friend and user fields
// friendSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "friend user",
//   });
//   next();
// });

var friend = mongoose.model("Friend", friendSchema);
module.exports = friend;