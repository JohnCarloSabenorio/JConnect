const handlerFactory = require("./handlerFactory");
const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.updateAllUserNotifications = catchAsync(async (req, res) => {
  console.log(req.user);
  const updatedNotifs = await Notification.updateMany(
    { receiver: req.user._id },
    req.body
  );

  console.log("UPDATED NOTIFICATIONS:", updatedNotifs);
  if (!updatedNotifs) {
    return next(new AppError("Failed to update all notifications!", 400));
  }

  res.status(200).json({
    status: "success",
    message: "updated all user notifications",
    updatedNotifs,
  });
});
exports.createNotification = handlerFactory.createOne(Notification);
exports.getNotification = handlerFactory.getOne(Notification);
exports.getAllNotifications = handlerFactory.getAll(Notification);
exports.deleteNotification = handlerFactory.deleteOne(Notification);
exports.updateNotification = handlerFactory.updateOne(Notification);
