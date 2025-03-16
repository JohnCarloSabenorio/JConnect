const UserConversation = require("../models/userConversationModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const catchASync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.userConvoIsArchived = catchASync(async (req, res) => {
  // Find the user conversation using the id in params
  const userConvo = await UserConversation.find({
    user: req.user.id,
    conversation: req.params.id,
  });
  // Check the status of the user conversation if it is archived
  console.log(userConvo);

  res.status(200).json({
    status: "success",
    isArchived: userConvo[0].status === "archived",
  });
});

exports.getUserConvoStatus = catchASync(async (req, res) => {
  // Find the user conversation using the id in params
  const userConvo = await UserConversation.find({
    user: req.user.id,
    conversation: req.params.id,
  });
  console.log(userConvo);

  res.status(200).json({
    status: "success",
    userConvoStatus: userConvo[0].status,
  });
});

exports.archiveConversation = catchAsync(async (req, res) => {
  const archivedConvo = await UserConversation.findOneAndUpdate(
    {
      user: req.user.id,
      conversation: req.params.id,
    },
    {
      status: "archived",
    }
  );

  if (!archivedConvo) {
    return next(new AppError("Failed to archive conversation!", 400));
  }
  console.log("ARCHIVED CONVERASTION");

  res.status(200).json({
    status: "success",
    archivedConvo,
  });
});

exports.createUserConversation = handlerFactory.createOne(UserConversation);
exports.getAllUserConversation = handlerFactory.getAll(UserConversation);
exports.getUserConversation = handlerFactory.getOne(UserConversation);
exports.updateUserConversation = handlerFactory.updateOne(UserConversation);
exports.deleteUserConversation = handlerFactory.deleteOne(UserConversation);
