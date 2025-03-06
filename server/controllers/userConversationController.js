const UserConversation = require("../models/userConversationModel");
const catchAsync = require("../utils/catchAsync");
const catchASync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.createUserConversation = handlerFactory.createOne(UserConversation);
exports.getAllUserConversation = handlerFactory.getAll(UserConversation);
exports.getUserConversation = handlerFactory.getOne(UserConversation);
exports.updateUserConversation = handlerFactory.updateOne(UserConversation);
exports.deleteUserConversation = handlerFactory.deleteOne(UserConversation);
