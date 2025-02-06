"use strict";

var express = require("express");

var router = express.Router({
  mergeParams: true
});

var friendController = require("../controllers/friendController");

var authController = require("../controllers/authController");

var friend = require("../models/friendModel");

router.use(authController.protect);
router.route("/").get(friendController.getAllFriends).post(friendController.createFriend);
router.route("/:id").get(friendController.getFriend).patch(friendController.updateFriend)["delete"](friendController.deleteFriend);
router.route("/friendRequest/:friendId").post(friendController.sendFriendRequest); // NEEDS TO BE REVISED IN THE FUTURE

router.route("/currentUser/allFriends").get(friendController.getMyFriends);
router.route("/friendRequests/myFriendRequests").get(friendController.getMyFriendRequests); // Blocks or unblocks a user

module.exports = router;