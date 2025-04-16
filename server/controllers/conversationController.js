const Conversation = require("../models/conversationModel");
const UserConversation = require("../models/userConversationModel");
const User = require("../models/userModel");
const handleFactory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Add a person to an existing conversation
exports.addMember = catchAsync(async (req, res, next) => {
  const convo = await Conversation.findByIdAndUpdate(
    req.params.convoId,
    {
      $addToSet: {
        users: req.params.userId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Return an error if the conversation does not exist
  if (!convo) {
    return next(new AppError("The conversation does not exist!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Successfully added a member in the conversation!",
    data: convo,
  });
});

// Remove a person from an existing conversation
exports.removeMember = catchAsync(async (req, res, next) => {
  const convo = await Conversation.findByIdAndUpdate(
    req.params.convoId,
    {
      $pull: {
        users: req.params.userId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Return an error if the conversation does not exist
  if (!convo) {
    return next(new AppError("The conversation does not exist!", 404));
  }

  res.status(204).json({
    status: "success",
    message: "Successfully added a member in the conversation!",
    data: convo,
  });
});

// This checking is for a one on one conversation only
exports.checkConvoExists = catchAsync(async (req, res) => {
  // Check if conversation exists using id of two users
  const convo = await Conversation.find({
    users: { $all: [req.params.userId, req.user.id] },
    $expr: { $eq: [{ $size: "$users" }, 2] },
  });

  res.status(200).json({
    status: "success",
    data: convo,
  });
});

exports.createConversation = catchAsync(async (req, res) => {
  // Create a new conversation
  let newDoc = await Conversation.create(req.body);

  // Populate the user data
  newDoc = await Conversation.findById(newDoc._id).populate("users");

  // Check if the conversation is a group or not
  if (req.body.users.length === 2) {
    const usersFromDB = await User.find({ _id: { $in: req.body.users } });

    // Map users to their original order
    const usersMap = new Map(
      usersFromDB.map((user) => [user._id.toString(), user])
    );
    const [user1, user2] = req.body.users.map((id) =>
      usersMap.get(id.toString())
    );

    // Create user-conversation
    const newUserConversation = await UserConversation.create([
      {
        user: user1._id,
        conversation: newDoc._id,
        conversationName: user2.username,
      },
      {
        user: user2._id,
        conversation: newDoc._id,
        conversationName: user1.username,
      },
    ]);

    console.log(newUserConversation);

    currentUserNewConvo = await newUserConversation
      .find((convo) => convo.user.toString() === req.user.id)
      .populate("conversation");

    console.log("CURRENT USER ID:", req.user.id);
    console.log("NEW CONVERSATION OF CURRENT USER:", currentUserNewConvo);

    return res.status(200).json({
      status: "success",
      message: "New document successfully created!",
      data: currentUserNewConvo,
    });
  } else {
    await Promise.all(
      req.body.users.map(async (user) => {
        return await UserConversation.create({
          user: user,
          conversation: newDoc._id,
          isGroup: true,
        });
      })
    );
  }
});

// GENERIC HANDLERS
exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);
