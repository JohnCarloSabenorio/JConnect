"use strict";

var Message = require("./../models/messageModel");

var Conversation = require("../models/conversationModel");

exports.sendMessage = function _callee(io, socket, data) {
  var newMessage, populatedMessage, updatedConvo;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Message.create(data));

        case 2:
          newMessage = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(Message.findById(newMessage._id).populate("sender"));

        case 5:
          populatedMessage = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(data.conversation, {
            latestMessage: data.message
          }, {
            "new": true
          }));

        case 8:
          updatedConvo = _context.sent;
          console.log("updatedConvo data:", updatedConvo);
          io.to(data.conversation).emit("chat message", {
            msg: populatedMessage,
            convo: updatedConvo
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
};