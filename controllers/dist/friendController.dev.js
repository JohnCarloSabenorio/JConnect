"use strict";

var Friend = require("../models/friendModel");

var User = require("../models/userModel");

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var handlerFactory = require("./handlerFactory");

exports.initUserFriendBody = function (req, res, next) {
  if (req.params.friendId) {
    req.body.user = req.user.id;
    req.body.friend = req.params.friendId;
  }

  next();
};

exports.getAllFriends = handlerFactory.getAll(Friend);
exports.createFriend = handlerFactory.createOne(Friend);
exports.getFriend = handlerFactory.getOne(Friend);
exports.deleteFriend = handlerFactory.deleteOne(Friend);
exports.updateFriend = handlerFactory.updateOne(Friend);