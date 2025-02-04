"use strict";

var Friend = require("../models/friendModel");

var User = require("../models/userModel");

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var handlerFactory = require("./handlerFactory");

exports.setUserBody = function (req, res, next) {
  req.body.user = req.params.id;
  next();
};

exports.setUserFriendBody = catchAsync(function _callee(req, res, next) {
  var friend;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          req.body.user = req.user.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.find({
            email: req.body.email
          }));

        case 3:
          friend = _context.sent;

          if (!(!friend || friend.length == 0)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", next(new AppError("User to befriend cannot be found!", 404)));

        case 6:
          req.body.friend = friend[0]._id;
          next();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getAllFriends = handlerFactory.getAll(Friend);
exports.addFriend = handlerFactory.createOne(Friend);
exports.getFriend = handlerFactory.getOne(Friend);
exports.deleteFriend = handlerFactory.deleteOne(Friend);
exports.updateFriend = handlerFactory.updateOne(Friend);