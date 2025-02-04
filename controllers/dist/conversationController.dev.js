"use strict";

var Conversation = require("../models/conversationModel");

var handleFactory = require("./handlerFactory");

exports.createConversation = handleFactory.createOne(Conversation);
exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);