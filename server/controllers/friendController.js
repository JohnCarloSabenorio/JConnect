const friend = require("../models/friendModel");
const Friend = require("../models/friendModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

// REFACTOR THE FRIEND CONTROLLER AS CONTACT

// (Remove this)
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

// Refactor to "getMyContacts"
exports.getMyFriends = catchAsync(async (req, res) => {
  console.log("getting all my friends");
  const allMyFriends = await Friend.find({
    $or: [{ user1: req.user.id }, { user2: req.user.id }],
    status: "accepted",
  });

  // Filters out the id of the current user so only the friend id is retrieved
  const friend = allMyFriends.map((friend) => {
    friend = friend.toObject();
    if (friend.user1._id.toString() === req.user.id.toString()) {
      delete friend.user1;

      // This should replace the key of user2 to 'friend' instead
      friend.friend = friend.user2;
      delete friend.user2;
    } else {
      delete friend.user2;

      // This should replace the key of user1 to 'friend' instead
      friend.friend = friend.user1;
      delete friend.user1;
    }

    return friend;
  });

  res.status(200).json({
    status: "success",
    message: "All my friends retrieved!",
    data: friend,
  });
});

// This will get the requests sent to the current user from other people
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

// No need to check if the user is a friend
exports.isFriend = catchAsync(async (req, res) => {
  if (req.params.id === req.user.id) {
    res.status(200).json({
      status: "success",
      isFriend: false,
    });
  }

  const friend = await Friend.findOne({
    $or: [
      { $and: [{ user1: req.params.id }, { user2: req.user.id }] },
      { $and: [{ user1: req.user.id }, { user2: req.params.id }] },
    ],
  });

  res.status(200).json({
    status: "success",
    isFriend: friend ? true : false,
  });
});

// Refactor to "getBlockedUsers"
exports.getBlockedFriends = catchAsync(async (req, res, next) => {});

// Get strangers
exports.getNonFriendUsers = catchAsync(async (req, res) => {
  // Get list of friends of the current user
  const friends = await Friend.find({
    $or: [{ user1: req.user.id }, { user2: req.user.id }],
    status: "accepted",
  });

  // Filter the ids of the friends
  const friendIds = friends.map((friend) =>
    friend.user1._id == req.user.id ? friend.user2._id : friend.user1._id
  );

  // Get non-friend users
  const nonFriends = await User.find({
    _id: { $nin: [...friendIds, req.user.id] },
  });

  res.status(200).json({
    status: "success",
    message: "Successfully retrieved non-friend users.",
    nonFriends,
  });
});

// GENERIC HANDLERS
exports.getAllFriends = handlerFactory.getAll(Friend);
exports.createFriend = handlerFactory.createOne(Friend);
exports.getFriend = handlerFactory.getOne(Friend);
exports.deleteFriend = handlerFactory.deleteOne(Friend);
exports.updateFriend = handlerFactory.updateOne(Friend);
