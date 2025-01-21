const Message = require("./../models/messageModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const handlerFactory = require("./handlerFactory");

exports.initSenderConvo = (req, res, next) => {
  req.body.sender = req.user.id;
  console.log("CONVERSATION ID:", req.params.convoId);
  next();
};

exports.sendMessage = handlerFactory.createOne(Message);
exports.getMessage = handlerFactory.getOne(Message);
exports.getMessages = handlerFactory.getAll(Message);
exports.updateMessage = handlerFactory.updateOne(Message);
exports.deleteMessage = handlerFactory.deleteOne(Message);
