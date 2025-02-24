"use strict";

var Conversation = require("../models/conversationModel");

var handleFactory = require("./handlerFactory");

var catchAsync = require("../utils/catchAsync");

var AppError = require("../utils/appError");

exports.addMember = catchAsync(function _callee(req, res, next) {
  var convo;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(req.params.convoId, {
            $addToSet: {
              users: req.params.userId
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 2:
          convo = _context.sent;

          if (convo) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", next(new AppError("The conversation does not exist!", 404)));

        case 5:
          res.status(200).json({
            status: "success",
            message: "Successfully added a member in the conversation!",
            data: convo
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.removeMember = catchAsync(function _callee2(req, res, next) {
  var convo;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(req.params.convoId, {
            $pull: {
              users: req.params.userId
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 2:
          convo = _context2.sent;

          if (convo) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new AppError("The conversation does not exist!", 404)));

        case 5:
          res.status(204).json({
            status: "success",
            message: "Successfully added a member in the conversation!",
            data: convo
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // This checking is for a one on one conversation only

exports.checkConvoExists = catchAsync(function _callee3(req, res) {
  var convo;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Check if conversation exists using id of two users
          console.log("FRIEND ID:", req.params.friendId);
          console.log("USER ID:", req.user.id);
          _context3.next = 4;
          return regeneratorRuntime.awrap(Conversation.find({
            users: {
              $all: [req.params.friendId, req.user.id]
            },
            $expr: {
              $eq: [{
                $size: "$users"
              }, 2]
            }
          }));

        case 4:
          convo = _context3.sent;
          res.status(200).json({
            status: "success",
            data: convo
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.createConversation = handleFactory.createOne(Conversation);
exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);