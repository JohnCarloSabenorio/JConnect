"use strict";

var Message = require("./../models/messageModel");

var catchAsync = require("./../utils/catchAsync");

var AppError = require("./../utils/appError");

var handlerFactory = require("./handlerFactory");

exports.initSenderConvo = function (req, res, next) {
  req.body.sender = req.user.id;
  console.log("CONVERSATION ID:", req.params.convoId);
  next();
};

exports.createMessage = handlerFactory.createOne(Message);
exports.getMessage = handlerFactory.getOne(Message);
exports.getAllMessages = handlerFactory.getAll(Message);
exports.updateMessage = handlerFactory.updateOne(Message);
exports.deleteMessage = handlerFactory.deleteOne(Message);