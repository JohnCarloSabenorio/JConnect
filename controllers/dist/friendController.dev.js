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
exports.deleteFriend = handlerFactory.deleteOne(Friend); // exports.getAllFriends = catchAsync(async (req, res) => {
//   const friends = await User.findById(req.params.id).select("contacts");
//   res.status(200).json({
//     status: "success",
//     data: friends,
//   });
// });
// // NEED REVISION
// exports.updateFriends = catchAsync(async (req, res) => {
//   console.log("FRIENDS:");
//   console.log(req.body.friends);
//   const newFriends = Array.isArray(req.body.friends)
// ? req.body.friends
//     : [req.body.friends];
//   updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       $addToSet: {
//         friends: { $each: newFriends },
//       },
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   if (!updatedUser) {
//     next(new AppError("User does not exist!", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     message: "Successfully added contact!",
//   });
// });
// exports.blockContact = catchAsync(async (req, res) => {
//   console.log(req.body);
//   await User.findByIdAndUpdate(req.params.id, {
//     $pull: {
//       contacts: req.body.userId,
//     },
//   });
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     {
//       $push: {
//         blockedUsers: req.body.userId,
//       },
//     },
//     {
//       new: true,
//     }
//   );
//   res.status(200).json({
//     status: "success",
//     message: "Successfully blocked contact!",
//     data: user,
//   });
// });
// exports.unblockContact = catchAsync(async (req, res) => {
//   console.log(req.body);
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     {
//       $pull: {
//         blockedUsers: req.body.userId,
//       },
//     },
//     { new: true }
//   );
//   res.status(200).json({
//     status: "success",
//     message: "Successfully unblocked contact!",
//     data: user,
//   });
// });