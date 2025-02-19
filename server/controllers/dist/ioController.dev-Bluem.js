"use strict";

var Message = require("./../models/messageModel");

exports.sendMessage = function _callee(io, socket, data) {
  var newMessage, populatedMessage;
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
          io.emit("chat message", populatedMessage);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};