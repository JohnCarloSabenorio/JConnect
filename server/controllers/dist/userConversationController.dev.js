"use strict";

var UserConversation = require("../models/userConversationModel");

var Conversation = require("../models/conversationModel");

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var catchASync = require("../utils/catchAsync");

var handlerFactory = require("./handlerFactory"); // Check if the conversation of the user is archived


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
}); // Get the current status of a conversation

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
}); // Archive an existing conversation

exports.archiveConversation = catchAsync(function _callee3(req, res, next) {
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
exports.blockConversation = catchAsync(function _callee4(req, res, next) {
  var blockedConvo;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(UserConversation.findOneAndUpdate({
            user: req.user.id,
            conversation: req.params.id
          }, {
            status: "blocked"
          }, {
            "new": true
          }));

        case 2:
          blockedConvo = _context4.sent;

          if (blockedConvo) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new AppError("Failed to archive conversation!", 400)));

        case 5:
          console.log("BLOCKED CONVERASTION:", blockedConvo);
          res.status(200).json({
            status: "success",
            blockedConvo: blockedConvo.toObject({
              virtuals: true
            })
          });

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // Unarchive an existing conversation

exports.unarchiveConversation = catchASync(function _callee5(req, res, next) {
  var unarchivedConvo;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(UserConversation.findOneAndUpdate({
            user: req.user.id,
            conversation: req.params.id
          }, {
            status: "active"
          }));

        case 2:
          unarchivedConvo = _context5.sent;

          if (unarchivedConvo) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new AppError("Failed to restore archived conversation!", 400)));

        case 5:
          res.status(200).json({
            status: "success",
            unarchivedConvo: unarchivedConvo
          });

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.unblockConversation = catchAsync(function _callee6(req, res, next) {
  var unblockedConvo;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log("unblocking conversation...");
          _context6.next = 3;
          return regeneratorRuntime.awrap(UserConversation.findOneAndUpdate({
            user: req.user.id,
            conversation: req.params.id
          }, {
            status: "active"
          }, {
            "new": true
          }));

        case 3:
          unblockedConvo = _context6.sent;

          if (unblockedConvo) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", next(new AppError("Failed to restore archived conversation!", 400)));

        case 6:
          res.status(200).json({
            status: "success",
            unblockedConvo: unblockedConvo
          });

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.getConversationName = catchASync(function _callee7(req, res, next) {
  var conversation;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(UserConversation.find({
            user: req.user.id,
            conversation: req.params.convoId
          }));

        case 2:
          conversation = _context7.sent;
          console.log("THE CONVERSATION:", conversation);
          res.status(200).json({
            status: "success",
            message: "Conversation name successfully retrieved!"
          });

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.getConversationWithUser = catchAsync(function _callee8(req, res, next) {
  var convo, userConversation;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log("GETTING user conversation record..."); // Check if conversation exists using id of two users

          _context8.next = 3;
          return regeneratorRuntime.awrap(Conversation.findOne({
            users: {
              $all: [req.params.userId, req.user.id]
            },
            $expr: {
              $eq: [{
                $size: "$users"
              }, 2]
            }
          }));

        case 3:
          convo = _context8.sent;
          userConversation = null; // Get the user conversation record that matches the current user and conversation

          if (!convo) {
            _context8.next = 9;
            break;
          }

          _context8.next = 8;
          return regeneratorRuntime.awrap(UserConversation.findOne({
            user: req.user.id,
            conversation: convo._id
          }).populate("conversation"));

        case 8:
          userConversation = _context8.sent;

        case 9:
          console.log("THE USER CONVERSATION:", userConversation);
          res.status(200).json({
            status: "success",
            message: "User conversation record successfully retrieved!",
            data: userConversation
          });

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  });
});
exports.activateUserConversation = catchASync(function _callee9(req, res, next) {
  var userConversation;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(UserConversation.findByIdAndUpdate(req.params.userConvoId, {
            status: "active"
          }));

        case 2:
          userConversation = _context9.sent;

          if (userConversation) {
            _context9.next = 5;
            break;
          }

          return _context9.abrupt("return", next(new AppError("Failed to activate user conversation!", 400)));

        case 5:
          res.status(200).json({
            status: "success",
            message: "user conversation activated successfully!",
            userConversation: userConversation
          });

        case 6:
        case "end":
          return _context9.stop();
      }
    }
  });
});
exports.getUserNamesAndNicknames = catchASync(function _callee10(req, res, next) {
  var userConversations;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          console.log("getting names..."); // Find all user-convo data in the conversation

          _context10.next = 3;
          return regeneratorRuntime.awrap(UserConversation.find({
            conversation: req.params.convoId
          }).populate({
            path: "user",
            select: "username profilePicture"
          }));

        case 3:
          userConversations = _context10.sent;
          userConversations = userConversations.map(function (doc) {
            return doc.toObject({
              virtuals: true
            });
          });
          console.log("the nicknames data:", userConversations);
          res.status(200).json({
            status: "success",
            message: "Successfully retrieved all names and nicknames",
            userConversations: userConversations
          });

        case 7:
        case "end":
          return _context10.stop();
      }
    }
  });
}); // GENERIC HANDLERS

exports.createUserConversation = handlerFactory.createOne(UserConversation);
exports.getAllUserConversation = handlerFactory.getAll(UserConversation);
exports.getUserConversation = handlerFactory.getOne(UserConversation);
exports.updateUserConversation = handlerFactory.updateOne(UserConversation);
exports.deleteUserConversation = handlerFactory.deleteOne(UserConversation);