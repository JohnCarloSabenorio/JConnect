const Conversation = require("../models/conversationModel");
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

// GENERIC HANDLERS
exports.createConversation = handleFactory.createOne(Conversation);
exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);
