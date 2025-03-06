const mongoose = require("mongoose");
const validator = require("validator");

const convoSchema = new mongoose.Schema(
  {
    // If user.length > 2, it is a group, if not it is a 1 to 1 convo
    users: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: (arr) => arr.length >= 2 && arr.length <= 10,
        message: "{PATH} must be between 2 and 10 users",
      },
    },
    convoName: {
      type: String,
      default: "New Conversation",
    },
    convoImage: {
      type: String,
      default: "default-gc.png",
    },
    status: {
      type: String,
      enum: {
        values: ["active", "archived"],
      },
    },

    latestMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// DOCUMENT MIDDLEWARES

// QUERY MIDDLEWARES

convoSchema.pre(/^find/, function (next) {
  this.populate({
    path: "users",
  });
  next();
});

const ConvoModel = mongoose.model("Conversation", convoSchema);

module.exports = ConvoModel;
