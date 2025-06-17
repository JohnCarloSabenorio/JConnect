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

exports.addMultipleMembers = catchAsync(async (req, res, next) => {
  console.log("NEW MEMBERS TO ADD:", req.body.newUsers);
  const convo = await Conversation.findByIdAndUpdate(
    req.params.convoId,
    {
      $addToSet: {
        users: { $each: req.body.newUsers },
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
    message: "Successfully added new members in the conversation",
    updatedUsers: convo.users,
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
  console.log("Creating Conversation");
  // Create a new conversation
  let newConversation = await Conversation.create(req.body);

  // Populate the user data
  newConversation = await Conversation.findById(newConversation._id).populate(
    "users"
  );

  // Check if the conversation is a group or not
  const usersFromDB = await User.find({ _id: { $in: req.body.users } });

  // Create user-conversation

  // Check if it is a group conversation or not
  if (newConversation.users.length > 2) {
    // Create Group Name using first three usernames
    const newGroupName = `${usersFromDB[0].username}, ${usersFromDB[1].username}, ${usersFromDB[2].username},...`;

    // Create an array containing objects of new group conversations
    const newGroupUserConversationData = usersFromDB.map((user) => {
      return {
        user: user._id,
        conversation: newConversation._id,
        conversationName: newGroupName,
        isGroup: true,
      };
    });

    // Create new user conversation documents
    const newUserConversation = await UserConversation.create(
      newGroupUserConversationData
    );

    // Find the document of the current user
    currentUserNewConvo = await newUserConversation
      .find((convo) => convo.user.toString() === "67a18fc157b4f802490ce204") // replace this with req.user.id
      .populate("conversation");

    return res.status(200).json({
      status: "success",
      message: "New conversation successfully created!",
      data: currentUserNewConvo,
    });
  } else {
    const newDirectUserConversations = await UserConversation.create([
      {
        user: usersFromDB[0]._id,
        conversation: newConversation._id,
        conversationName: usersFromDB[1].username,
      },
      {
        user: usersFromDB[1]._id,
        conversation: newConversation._id,
        conversationName: usersFromDB[0].username,
      },
    ]);

    currentUserNewConvo = await newDirectUserConversations
      .find((convo) => convo.user.toString() === "67a18fc157b4f802490ce204")
      .populate("conversation");

    return res.status(200).json({
      status: "success",
      message: "New conversation successfully created!",
      data: currentUserNewConvo,
    });
  }
});

// GENERIC HANDLERS
exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);
