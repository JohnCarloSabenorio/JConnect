"use strict";

var mongoose = require("mongoose");

var friendSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  friend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    "enum": ["pending", "accepted", "blocked"],
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
});
friendSchema.index({
  user: 1,
  friend: 1
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