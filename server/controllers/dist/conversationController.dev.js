"use strict";

var Conversation = require("../models/conversationModel");

var UserConversation = require("../models/userConversationModel");

var User = require("../models/userModel");

var handleFactory = require("./handlerFactory");

var catchAsync = require("../utils/catchAsync");

var AppError = require("../utils/appError");

var multer = require("multer");

var sharp = require("sharp");

var multerstorage = multer.memoryStorage();

var multerFilter = function multerFilter(req, file, cb) {
  console.log("the file:", file);

  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please try again.", 400), false);
  }
};

var upload = multer({
  storage: multerstorage,
  fileFilter: multerFilter
});
exports.uploadImage = upload.single("convoImage");
exports.resizeImage = catchAsync(function _callee(req, res, next) {
  var filename;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.file) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          console.log("the req file uploaded:", req.file); // Create a filename

          filename = "convo-image-".concat(Date.now(), "-").concat(req.user.id, ".jpeg"); // Resize the image and upload

          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(sharp(req.file.buffer).toFormat("jpeg").jpeg({
            quality: 90
          }).toFile("public/img/gcImages/".concat(filename)));

        case 7:
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](4);
          console.log("error in uploading gc:", _context.t0);

        case 12:
          // Add the filename to the body
          req.body.convoImage = filename;
          next();

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 9]]);
}); // Add a person to an existing conversation

exports.addMember = catchAsync(function _callee2(req, res, next) {
  var convo;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(req.params.convoId, {
            $addToSet: {
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
          res.status(200).json({
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
});
exports.addMultipleMembers = catchAsync(function _callee3(req, res, next) {
  var convo, usersFromDB, newUsersFromDB, newGroupName, usernames, i, newGroupUserConversationData, newUserConversation;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
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

        case 2:
          convo = _context3.sent;
          convo = convo.toObject({
            virtuals: true
          }); // Return an error if the conversation does not exist

          if (convo) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", next(new AppError("The conversation does not exist!", 404)));

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $in: convo.users
            }
          }).limit(3));

        case 8:
          usersFromDB = _context3.sent;
          _context3.next = 11;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $in: req.body.newUsers
            }
          }));

        case 11:
          newUsersFromDB = _context3.sent;
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
              status: "active",
              role: "member"
            };
          }); // Create new user conversation documents

          _context3.next = 18;
          return regeneratorRuntime.awrap(UserConversation.create(newGroupUserConversationData));

        case 18:
          newUserConversation = _context3.sent;

          if (newUserConversation) {
            _context3.next = 21;
            break;
          }

          return _context3.abrupt("return", next(new AppError("Failed to create new user conversation for the new members.", 400)));

        case 21:
          // Create an array containing objects of new group conversations
          res.status(200).json({
            status: "success",
            message: "Successfully added new members in the conversation",
            updatedUsers: convo.users
          });

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // Remove a person from an existing conversation

exports.removeMember = catchAsync(function _callee4(req, res, next) {
  var convo;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(req.params.convoId, {
            $pull: {
              users: req.params.userId
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 2:
          convo = _context4.sent;

          if (convo) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new AppError("The conversation does not exist!", 404)));

        case 5:
          res.status(204).json({
            status: "success",
            message: "Successfully added a member in the conversation!",
            data: convo
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.removeMultipleMembers = catchAsync(function _callee5(req, res, next) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // This checking is for a one on one conversation only

exports.checkConvoExists = catchAsync(function _callee6(req, res) {
  var convo;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
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
          convo = _context6.sent;
          res.status(200).json({
            status: "success",
            data: convo
          });

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.createConversation = catchAsync(function _callee7(req, res) {
  var newConversation, usersFromDB, newGroupName, newGroupUserConversationData, newUserConversations, populatedUserConversations, newDirectUserConversations, _currentUserNewConvo;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log("Creating Conversation...");
          console.log("the req body:", req.body);
          console.log("is it a group:", req.body.isGroup);
          _context7.next = 5;
          return regeneratorRuntime.awrap(Conversation.create(req.body));

        case 5:
          newConversation = _context7.sent;
          _context7.next = 8;
          return regeneratorRuntime.awrap(Conversation.findById(newConversation._id).populate("users"));

        case 8:
          newConversation = _context7.sent;
          _context7.next = 11;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $in: req.body.users
            }
          }));

        case 11:
          usersFromDB = _context7.sent;

          if (!JSON.parse(req.body.isGroup)) {
            _context7.next = 30;
            break;
          }

          // Create Group Name using first three usernames
          newGroupName = req.body.conversationName ? req.body.conversationName : usersFromDB.length >= 3 ? "".concat(usersFromDB[0].username, ", ").concat(usersFromDB[1].username, ", ").concat(usersFromDB[2].username, ",...") : "".concat(usersFromDB[0].username, ", ").concat(usersFromDB[1].username, ",...");
          newConversation.conversationName = newGroupName;
          _context7.next = 17;
          return regeneratorRuntime.awrap(newConversation.save());

        case 17:
          newConversation = newConversation.toObject({
            virtuals: true
          }); // Create an array containing objects of new group conversations

          newGroupUserConversationData = usersFromDB.map(function (user) {
            var userRole = req.user.id == user._id.toString() ? "owner" : "member";
            var userStatus = "active";
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

          _context7.next = 21;
          return regeneratorRuntime.awrap(UserConversation.create(newGroupUserConversationData));

        case 21:
          newUserConversations = _context7.sent;
          _context7.next = 24;
          return regeneratorRuntime.awrap(UserConversation.populate(newUserConversations, {
            path: "conversation"
          }));

        case 24:
          populatedUserConversations = _context7.sent;
          populatedUserConversations = populatedUserConversations.map(function (data) {
            return data.toObject({
              virtuals: true
            });
          }); // Find the document of the current user

          currentUserNewConvo = populatedUserConversations.find(function (userconvo) {
            return userconvo.user.toString() === req.user.id;
          });
          return _context7.abrupt("return", res.status(200).json({
            status: "success",
            message: "New conversation successfully created!",
            data: {
              newUserConversations: populatedUserConversations,
              currentUserNewConversation: currentUserNewConvo,
              users: newConversation.users
            }
          }));

        case 30:
          console.log("creating a direct conversation!!");
          _context7.next = 33;
          return regeneratorRuntime.awrap(UserConversation.create([{
            user: usersFromDB[0]._id,
            conversation: newConversation._id,
            conversationName: usersFromDB[1].username
          }, {
            user: usersFromDB[1]._id,
            conversation: newConversation._id,
            conversationName: usersFromDB[0].username
          }]));

        case 33:
          newDirectUserConversations = _context7.sent;
          _context7.next = 36;
          return regeneratorRuntime.awrap(newDirectUserConversations.find(function (convo) {
            return convo.user.toString() === req.user.id;
          }).populate("conversation"));

        case 36:
          _currentUserNewConvo = _context7.sent;
          return _context7.abrupt("return", res.status(200).json({
            status: "success",
            message: "New conversation successfully created!",
            data: _currentUserNewConvo.toObject({
              virtuals: true
            })
          }));

        case 38:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.getMutualGroupChats = catchAsync(function _callee8(req, res, next) {
  var mutualConversations;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Conversation.find({
            users: {
              $all: [req.user.id, req.params.userId]
            },
            isGroup: true
          }));

        case 2:
          mutualConversations = _context8.sent;
          mutualConversations = mutualConversations.map(function (convoData) {
            return convoData.toObject({
              virtuals: true
            });
          });
          res.status(200).json({
            status: "success",
            message: "Successfully retrieved mutual conversations.",
            mutualConversations: mutualConversations
          });

        case 5:
        case "end":
          return _context8.stop();
      }
    }
  });
}); // GENERIC HANDLERS

exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);