"use strict";

var express = require("express");

var router = express.Router();

var friendController = require("../controllers/friendController");

var authController = require("../controllers/authController");

var friend = require("../models/friendModel"); // router
//   .route("/")
//   .get(friendController.getAllFriends)
//   .patch(friendController.updateFriends);


router.use(authController.protect);
router.route("/").get(friendController.setUserBody, friendController.getAllFriends).post(friendController.setUserFriendBody, friendController.addFriend);
router.route("/:id").get(friendController.getFriend).patch(friendController.updateFriend)["delete"](friendController.deleteFriend); // Blocks or unblocks a user

module.exports = router;