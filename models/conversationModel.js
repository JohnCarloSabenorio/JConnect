const mongoose = require("mongoose");
const validator = require("validator");

const convoSchema = new mongoose.Schema(
  {
    // If user.length > 2, it is a group, if not it is a 1 to 1 convo
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Message,
      },
    ],
    convoName: {
      type: String,
    },
    convoImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ConvoModel = mongoose.model("Conversation", convoSchema);

module.exports = ConvoModel;
