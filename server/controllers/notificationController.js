const handlerFactory = require("./handlerFactory");
const Notification = require("../models/notificationModel");
exports.createNotification = handlerFactory.createOne(Notification);
exports.getNotification = handlerFactory.getOne(Notification);
exports.getAllNotifications = handlerFactory.getAll(Notification);
exports.deleteNotification = handlerFactory.deleteOne(Notification);
exports.updateNotification = handlerFactory.updateOne(Notification);
