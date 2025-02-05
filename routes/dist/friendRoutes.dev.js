"use strict";

var express = require("express");

var router = express.Router({
  mergeParams: true
});

var friendController = require("../controllers/friendController");

var authController = require("../controllers/authController");

var friend = require("../models/friendModel");

router.use(authController.protect); // get all friends need to be improved

router.route("/").get(friendController.getAllFriends).post(friendController.initUserFriendBody, friendController.createFriend);
router.route("/:id").get(friendController.getFriend).patch(friendController.updateFriend)["delete"](friendController.deleteFriend); // Blocks or unblocks a user

module.exports = router;