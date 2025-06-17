"use strict";

var Conversation = require("../models/conversationModel");

var UserConversation = require("../models/userConversationModel");

var User = require("../models/userModel");

var handleFactory = require("./handlerFactory");

var catchAsync = require("../utils/catchAsync");

var AppError = require("../utils/appError"); // Add a person to an existing conversation


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
exports.addMultipleMembers = catchAsync(function _callee2(req, res, next) {
  var convo;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("NEW MEMBERS TO ADD:", req.body.newUsers);
          _context2.next = 3;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(req.params.convoId, {
            $addToSet: {
              users: {
                $each: req.body.newUsers
              }
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 3:
          convo = _context2.sent;

          if (convo) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", next(new AppError("The conversation does not exist!", 404)));

        case 6:
          res.status(200).json({
            status: "success",
            message: "Successfully added new members in the conversation",
            updatedUsers: convo.users
          });

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Remove a person from an existing conversation

exports.removeMember = catchAsync(function _callee3(req, res, next) {
  var convo;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(req.params.convoId, {
            $pull: {
              users: req.params.userId
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 2:
          convo = _context3.sent;

          if (convo) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new AppError("The conversation does not exist!", 404)));

        case 5:
          res.status(204).json({
            status: "success",
            message: "Successfully added a member in the conversation!",
            data: convo
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // This checking is for a one on one conversation only

exports.checkConvoExists = catchAsync(function _callee4(req, res) {
  var convo;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Conversation.find({
            users: {
              $all: [req.params.userId, req.user.id]
            },
            $expr: {
              $eq: [{
                $size: "$users"
              }, 2]
            }
          }));

        case 2:
          convo = _context4.sent;
          res.status(200).json({
            status: "success",
            data: convo
          });

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.createConversation = catchAsync(function _callee5(req, res) {
  var newConversation, usersFromDB, newGroupName, newGroupUserConversationData, newUserConversation, newDirectUserConversations;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log("Creating Conversation"); // Create a new conversation

          _context5.next = 3;
          return regeneratorRuntime.awrap(Conversation.create(req.body));

        case 3:
          newConversation = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(Conversation.findById(newConversation._id).populate("users"));

        case 6:
          newConversation = _context5.sent;
          _context5.next = 9;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $in: req.body.users
            }
          }));

        case 9:
          usersFromDB = _context5.sent;

          if (!(newConversation.users.length > 2)) {
            _context5.next = 22;
            break;
          }

          // Create Group Name using first three usernames
          newGroupName = "".concat(usersFromDB[0].username, ", ").concat(usersFromDB[1].username, ", ").concat(usersFromDB[2].username, ",..."); // Create an array containing objects of new group conversations

          newGroupUserConversationData = usersFromDB.map(function (user) {
            return {
              user: user._id,
              conversation: newConversation._id,
              conversationName: newGroupName,
              isGroup: true
            };
          }); // Create new user conversation documents

          _context5.next = 15;
          return regeneratorRuntime.awrap(UserConversation.create(newGroupUserConversationData));

        case 15:
          newUserConversation = _context5.sent;
          _context5.next = 18;
          return regeneratorRuntime.awrap(newUserConversation.find(function (convo) {
            return convo.user.toString() === "67a18fc157b4f802490ce204";
          }) // replace this with req.user.id
          .populate("conversation"));

        case 18:
          currentUserNewConvo = _context5.sent;
          return _context5.abrupt("return", res.status(200).json({
            status: "success",
            message: "New conversation successfully created!",
            data: currentUserNewConvo
          }));

        case 22:
          _context5.next = 24;
          return regeneratorRuntime.awrap(UserConversation.create([{
            user: usersFromDB[0]._id,
            conversation: newConversation._id,
            conversationName: usersFromDB[1].username
          }, {
            user: usersFromDB[1]._id,
            conversation: newConversation._id,
            conversationName: usersFromDB[0].username
          }]));

        case 24:
          newDirectUserConversations = _context5.sent;
          _context5.next = 27;
          return regeneratorRuntime.awrap(newDirectUserConversations.find(function (convo) {
            return convo.user.toString() === "67a18fc157b4f802490ce204";
          }).populate("conversation"));

        case 27:
          currentUserNewConvo = _context5.sent;
          return _context5.abrupt("return", res.status(200).json({
            status: "success",
            message: "New conversation successfully created!",
            data: currentUserNewConvo
          }));

        case 29:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // GENERIC HANDLERS

exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);