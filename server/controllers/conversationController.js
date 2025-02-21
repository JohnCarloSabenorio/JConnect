const Conversation = require("../models/conversationModel");
const handleFactory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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

  if (!convo) {
    return next(new AppError("The conversation does not exist!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Successfully added a member in the conversation!",
    data: convo,
  });
});

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
  console.log("FRIEND ID:", req.params.friendId);
  console.log("USER ID:", req.user.id);
  const convo = await Conversation.find({
    users: { $all: [req.params.friendId, req.user.id] },
    $expr: { $eq: [{ $size: "$users" }, 2] },
  });

  res.status(200).json({
    status: "success",
    message: "Conversation exists!",
    data: convo,
  });
});

exports.createConversation = handleFactory.createOne(Conversation);
exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);
