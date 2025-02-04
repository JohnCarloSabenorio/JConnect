const Friend = require("../models/friendModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.setUserBody = (req, res, next) => {
  req.body.user = req.params.id;
  next();
};

exports.setUserFriendBody = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const friend = await User.find({ email: req.body.email });

  if (!friend || friend.length == 0) {
    return next(new AppError("User to befriend cannot be found!", 404));
  }
  req.body.friend = friend[0]._id;
  next();
});

exports.getAllFriends = handlerFactory.getAll(Friend);
exports.addFriend = handlerFactory.createOne(Friend);
exports.getFriend = handlerFactory.getOne(Friend);
exports.deleteFriend = handlerFactory.deleteOne(Friend);

// exports.getAllFriends = catchAsync(async (req, res) => {
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
