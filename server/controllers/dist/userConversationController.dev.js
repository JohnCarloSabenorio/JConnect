"use strict";

var UserConversation = require("../models/userConversationModel");

var catchAsync = require("../utils/catchAsync");

var catchASync = require("../utils/catchAsync");

var handlerFactory = require("./handlerFactory");

exports.createUserConversation = handlerFactory.createOne(UserConversation);
exports.getAllUserConversation = handlerFactory.getAll(UserConversation);
exports.getUserConversation = handlerFactory.getOne(UserConversation);
exports.updateUserConversation = handlerFactory.updateOne(UserConversation);
exports.deleteUserConversation = handlerFactory.deleteOne(UserConversation);