"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var friend = require("../models/friendModel");

var Friend = require("../models/friendModel");

var User = require("../models/userModel");

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var handlerFactory = require("./handlerFactory"); // REFACTOR THE FRIEND CONTROLLER AS CONTACT
// (Remove this)


exports.sendFriendRequest = catchAsync(function _callee(req, res, next) {
  var friendRequest;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Friend.create({
            user1: req.user.id,
            user2: req.params.friendId
          }));

        case 2:
          friendRequest = _context.sent;

          if (friendRequest) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", next(new AppError("Failed to send friend request!", 400)));

        case 5:
          res.status(200).json({
            status: "success",
            message: "Friend request sent!",
            data: friendRequest
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Refactor to "getMyContacts"

exports.getMyFriends = catchAsync(function _callee2(req, res) {
  var allMyFriends, friend;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("getting all my friends");
          _context2.next = 3;
          return regeneratorRuntime.awrap(Friend.find({
            $or: [{
              user1: req.user.id
            }, {
              user2: req.user.id
            }],
            status: "accepted"
          }));

        case 3:
          allMyFriends = _context2.sent;
          // Filters out the id of the current user so only the friend id is retrieved
          friend = allMyFriends.map(function (friend) {
            friend = friend.toObject();

            if (friend.user1._id.toString() === req.user.id.toString()) {
              delete friend.user1; // This should replace the key of user2 to 'friend' instead

              friend.friend = friend.user2;
              delete friend.user2;
            } else {
              delete friend.user2; // This should replace the key of user1 to 'friend' instead

              friend.friend = friend.user1;
              delete friend.user1;
            }

            return friend;
          });
          res.status(200).json({
            status: "success",
            message: "All my friends retrieved!",
            data: friend
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // No need to get friend requests

exports.getMyFriendRequests = catchAsync(function _callee3(req, res, next) {
  var friendRequests;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Friend.find({
            user2: req.user.id,
            status: "pending"
          }));

        case 2:
          friendRequests = _context3.sent;
          res.status(200).json({
            status: "success",
            message: "Friend request sent!",
            data: friendRequests
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // No need to check if the user is a friend

exports.isFriend = catchAsync(function _callee4(req, res) {
  var friend;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (req.params.id === req.user.id) {
            res.status(200).json({
              status: "success",
              isFriend: false
            });
          }

          _context4.next = 3;
          return regeneratorRuntime.awrap(Friend.findOne({
            $or: [{
              $and: [{
                user1: req.params.id
              }, {
                user2: req.user.id
              }]
            }, {
              $and: [{
                user1: req.user.id
              }, {
                user2: req.params.id
              }]
            }]
          }));

        case 3:
          friend = _context4.sent;
          res.status(200).json({
            status: "success",
            isFriend: friend ? true : false
          });

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // Refactor to "getBlockedUsers"

exports.getBlockedFriends = catchAsync(function _callee5(req, res, next) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // Get strangers

exports.getNonFriendUsers = catchAsync(function _callee6(req, res) {
  var friends, friendIds, nonFriends;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Friend.find({
            $or: [{
              user1: req.user.id
            }, {
              user2: req.user.id
            }],
            status: "accepted"
          }));

        case 2:
          friends = _context6.sent;
          // Filter the ids of the friends
          friendIds = friends.map(function (friend) {
            return friend.user1._id == req.user.id ? friend.user2._id : friend.user1._id;
          }); // Get non-friend users

          _context6.next = 6;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $nin: [].concat(_toConsumableArray(friendIds), [req.user.id])
            }
          }));

        case 6:
          nonFriends = _context6.sent;
          res.status(200).json({
            status: "success",
            message: "Successfully retrieved non-friend users.",
            nonFriends: nonFriends
          });

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // GENERIC HANDLERS

exports.getAllFriends = handlerFactory.getAll(Friend);
exports.createFriend = handlerFactory.createOne(Friend);
exports.getFriend = handlerFactory.getOne(Friend);
exports.deleteFriend = handlerFactory.deleteOne(Friend);
exports.updateFriend = handlerFactory.updateOne(Friend);