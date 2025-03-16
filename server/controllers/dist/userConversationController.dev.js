"use strict";

var UserConversation = require("../models/userConversationModel");

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var catchASync = require("../utils/catchAsync");

var handlerFactory = require("./handlerFactory");

exports.userConvoIsArchived = catchASync(function _callee(req, res) {
  var userConvo;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(UserConversation.find({
            user: req.user.id,
            conversation: req.params.id
          }));

        case 2:
          userConvo = _context.sent;
          // Check the status of the user conversation if it is archived
          console.log(userConvo);
          res.status(200).json({
            status: "success",
            isArchived: userConvo[0].status === "archived"
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getUserConvoStatus = catchASync(function _callee2(req, res) {
  var userConvo;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(UserConversation.find({
            user: req.user.id,
            conversation: req.params.id
          }));

        case 2:
          userConvo = _context2.sent;
          console.log(userConvo);
          res.status(200).json({
            status: "success",
            userConvoStatus: userConvo[0].status
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.archiveConversation = catchAsync(function _callee3(req, res) {
  var archivedConvo;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(UserConversation.findOneAndUpdate({
            user: req.user.id,
            conversation: req.params.id
          }, {
            status: "archived"
          }));

        case 2:
          archivedConvo = _context3.sent;

          if (archivedConvo) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new AppError("Failed to archive conversation!", 400)));

        case 5:
          console.log("ARCHIVED CONVERASTION");
          res.status(200).json({
            status: "success",
            archivedConvo: archivedConvo
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.createUserConversation = handlerFactory.createOne(UserConversation);
exports.getAllUserConversation = handlerFactory.getAll(UserConversation);
exports.getUserConversation = handlerFactory.getOne(UserConversation);
exports.updateUserConversation = handlerFactory.updateOne(UserConversation);
exports.deleteUserConversation = handlerFactory.deleteOne(UserConversation);