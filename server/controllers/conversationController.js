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

exports.removeMember = async (req, res, next) => {
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
};

exports.createConversation = handleFactory.createOne(Conversation);
exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);
