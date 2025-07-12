"use strict";

var handlerFactory = require("./handlerFactory");

var Notification = require("../models/notificationModel");

var catchAsync = require("../utils/catchAsync");

var AppError = require("../utils/appError");

exports.updateAllUserNotifications = catchAsync(function _callee(req, res) {
  var updatedNotifs;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(req.user);
          _context.next = 3;
          return regeneratorRuntime.awrap(Notification.updateMany({
            receiver: req.user._id
          }, req.body));

        case 3:
          updatedNotifs = _context.sent;
          console.log("UPDATED NOTIFICATIONS:", updatedNotifs);

          if (updatedNotifs) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", next(new AppError("Failed to update all notifications!", 400)));

        case 7:
          res.status(200).json({
            status: "success",
            message: "updated all user notifications",
            updatedNotifs: updatedNotifs
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.createNotification = handlerFactory.createOne(Notification);
exports.getNotification = handlerFactory.getOne(Notification);
exports.getAllNotifications = handlerFactory.getAll(Notification);
exports.deleteNotification = handlerFactory.deleteOne(Notification);
exports.updateNotification = handlerFactory.updateOne(Notification);