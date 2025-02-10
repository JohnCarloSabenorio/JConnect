const Friend = require("../models/friendModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

// Needs to be revised, instead of adding id in the params, it needs to be an email, then use the email to query for the user2 for its id
// Note: It is not recommended to expose user id in the api, instead, add the email of the user in the body
exports.sendFriendRequest = catchAsync(async (req, res, next) => {
  const friendRequest = await Friend.create({
    user1: req.user.id,
    user2: req.params.friendId,
  });

  if (!friendRequest) {
    return next(new AppError("Failed to send friend request!", 400));
  }
  res.status(200).json({
    status: "success",
    message: "Friend request sent!",
    data: friendRequest,
  });
});

exports.getMyFriends = catchAsync(async (req, res) => {
  console.log("getting all my friends");
  const allMyFriends = await Friend.find({
    $or: [{ user1: req.user.id }, { user2: req.user.id }],
    status: "accepted",
  });

  res.status(200).json({
    status: "success",
    message: "All my friends retrieved!",
    data: allMyFriends,
  });
});

exports.getMyFriendRequests = catchAsync(async (req, res, next) => {
  const friendRequests = await Friend.find({
    user2: req.user.id,
    status: "pending",
  });

  res.status(200).json({
    status: "success",
    message: "Friend request sent!",
    data: friendRequests,
  });
});
exports.getSentRequests = catchAsync(async (req, res, next) => {});
exports.getBlockedFriends = catchAsync(async (req, res, next) => {});

exports.getAllFriends = handlerFactory.getAll(Friend);
exports.createFriend = handlerFactory.createOne(Friend);
exports.getFriend = handlerFactory.getOne(Friend);
exports.deleteFriend = handlerFactory.deleteOne(Friend);
exports.updateFriend = handlerFactory.updateOne(Friend);
