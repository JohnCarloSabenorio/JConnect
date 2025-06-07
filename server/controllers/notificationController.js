const handlerFactory = require("./handlerFactory");

exports.createNotification = handlerFactory.createOne();
exports.getNotification = handlerFactory.getOne();
exports.getAllNotifications = handlerFactory.getAll();
exports.deleteNotification = handlerFactory.deleteOne();
exports.updateNotification = handlerFactory.updateOne();
