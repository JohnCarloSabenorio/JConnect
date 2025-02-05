"use strict";

var Friend = require("../models/friendModel");

var User = require("../models/userModel");

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var handlerFactory = require("./handlerFactory"); // exports.setUserBody = (req, res, next) => {
//   req.body.user = req.params.id;
//   next();
// };
// exports.setUserFriendBody = catchAsync(async (req, res, next) => {
//   req.body.user = req.user.id;
//   const friend = await User.find({ email: req.body.email });
//   if (!friend || friend.length == 0) {
//     return next(new AppError("User to befriend cannot be found!", 404));
//   }
//   req.body.friend = friend[0]._id;
//   next();
// });


exports.getAllFriends = handlerFactory.getAll(Friend);
exports.addFriend = handlerFactory.createOne(Friend);
exports.getFriend = handlerFactory.getOne(Friend);
exports.deleteFriend = handlerFactory.deleteOne(Friend);
exports.updateFriend = handlerFactory.updateOne(Friend);