const Friend = require("../models/friendModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

// exports.setUserBody = (req, res, next) => {
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
