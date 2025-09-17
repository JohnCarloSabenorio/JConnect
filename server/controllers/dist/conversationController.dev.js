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
  var convo, usersFromDB, newUsersFromDB, newGroupName, usernames, i, newGroupUserConversationData, newUserConversation;
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
          _context2.next = 8;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $in: convo.users
            }
          }).limit(3));

        case 8:
          usersFromDB = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $in: req.body.newUsers
            }
          }));

        case 11:
          newUsersFromDB = _context2.sent;
          newGroupName = "";
          usernames = [];

          try {
            for (i = 0; i < usersFromDB.length; i++) {
              usernames.push(usersFromDB[i].username);
            }

            newGroupName = "".concat(usernames.join(", "), ",...");
          } catch (err) {
            console.log("An error has occurred when creating a group name:", err);
          } // Create user-conversation


          newGroupUserConversationData = newUsersFromDB.map(function (user) {
            return {
              user: user._id,
              nickname: "",
              conversation: convo._id,
              conversationName: newGroupName,
              isGroup: true,
              status: "pending",
              role: "member"
            };
          }); // Create new user conversation documents

          _context2.next = 18;
          return regeneratorRuntime.awrap(UserConversation.create(newGroupUserConversationData));

        case 18:
          newUserConversation = _context2.sent;

          if (newUserConversation) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", next(new AppError("Failed to create new user conversation for the new members.", 400)));

        case 21:
          // Create an array containing objects of new group conversations
          res.status(200).json({
            status: "success",
            message: "Successfully added new members in the conversation",
            updatedUsers: convo.users
          });

        case 22:
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
});
exports.removeMultipleMembers = catchAsync(function _callee4(req, res, next) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // This checking is for a one on one conversation only

exports.checkConvoExists = catchAsync(function _callee5(req, res) {
  var convo;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
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
          convo = _context5.sent;
          res.status(200).json({
            status: "success",
            data: convo
          });

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.createConversation = catchAsync(function _callee6(req, res) {
  var newConversation, usersFromDB, newGroupName, newGroupUserConversationData, newUserConversations, populatedUserConversations, newDirectUserConversations, _currentUserNewConvo;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log("Creating Conversation...");
          _context6.next = 3;
          return regeneratorRuntime.awrap(Conversation.create(req.body));

        case 3:
          newConversation = _context6.sent;
          _context6.next = 6;
          return regeneratorRuntime.awrap(Conversation.findById(newConversation._id).populate("users"));

        case 6:
          newConversation = _context6.sent;
          _context6.next = 9;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $in: req.body.users
            }
          }));

        case 9:
          usersFromDB = _context6.sent;

          if (!req.body.isGroup) {
            _context6.next = 28;
            break;
          }

          // Create Group Name using first three usernames
          newGroupName = req.body.conversationName ? req.body.conversationName : usersFromDB.length >= 3 ? "".concat(usersFromDB[0].username, ", ").concat(usersFromDB[1].username, ", ").concat(usersFromDB[2].username, ",...") : "".concat(usersFromDB[0].username, ", ").concat(usersFromDB[1].username, ",...");
          newConversation.conversationName = newGroupName;
          _context6.next = 15;
          return regeneratorRuntime.awrap(newConversation.save());

        case 15:
          console.log("the new conversation name:", newGroupName); // Create an array containing objects of new group conversations

          newGroupUserConversationData = usersFromDB.map(function (user) {
            var userRole = req.user.id == user._id.toString() ? "owner" : "member";
            var userStatus = req.user.id == user._id.toString() ? "active" : "pending";
            return {
              user: user._id,
              nickname: "",
              conversation: newConversation._id,
              conversationName: newGroupName,
              isGroup: true,
              status: userStatus,
              role: userRole
            };
          }); // Create new user conversation documents

          _context6.next = 19;
          return regeneratorRuntime.awrap(UserConversation.create(newGroupUserConversationData));

        case 19:
          newUserConversations = _context6.sent;
          console.log("new user conversations from group:", newUserConversations); // Populate the new user  conversations

          _context6.next = 23;
          return regeneratorRuntime.awrap(UserConversation.populate(newUserConversations, {
            path: "conversation"
          }));

        case 23:
          populatedUserConversations = _context6.sent;
          // Find the document of the current user
          currentUserNewConvo = populatedUserConversations.find(function (userconvo) {
            return userconvo.user.toString() === req.user.id;
          });
          return _context6.abrupt("return", res.status(200).json({
            status: "success",
            message: "New conversation successfully created!",
            data: {
              newUserConversations: populatedUserConversations,
              currentUserNewConversation: currentUserNewConvo,
              users: newConversation.users
            }
          }));

        case 28:
          _context6.next = 30;
          return regeneratorRuntime.awrap(UserConversation.create([{
            user: usersFromDB[0]._id,
            nickname: usersFromDB[1].username,
            conversation: newConversation._id,
            conversationName: usersFromDB[1].username
          }, {
            user: usersFromDB[1]._id,
            nickname: usersFromDB[0].username,
            conversation: newConversation._id,
            conversationName: usersFromDB[0].username
          }]));

        case 30:
          newDirectUserConversations = _context6.sent;
          _context6.next = 33;
          return regeneratorRuntime.awrap(newDirectUserConversations.find(function (convo) {
            return convo.user.toString() === req.user.id;
          }).populate("conversation"));

        case 33:
          _currentUserNewConvo = _context6.sent;
          return _context6.abrupt("return", res.status(200).json({
            status: "success",
            message: "New conversation successfully created!",
            data: _currentUserNewConvo.toObject({
              virtuals: true
            })
          }));

        case 35:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.getMutualGroupChats = catchAsync(function _callee7(req, res, next) {
  var mutualConversations;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Conversation.find({
            users: {
              $all: [req.user.id, req.params.userId]
            },
            isGroup: true
          }));

        case 2:
          mutualConversations = _context7.sent;
          mutualConversations = mutualConversations.map(function (convoData) {
            return convoData.toObject({
              virtuals: true
            });
          });
          console.log("mutual conversations:", mutualConversations);
          res.status(200).json({
            status: "success",
            message: "Successfully retrieved mutual conversations.",
            mutualConversations: mutualConversations
          });

        case 6:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // GENERIC HANDLERS

exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);