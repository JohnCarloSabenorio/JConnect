"use strict";

var express = require("express");

var router = express.Router({
  mergeParams: true
});

var convoRouter = require("./conversationRoutes");

var friendController = require("../controllers/friendController");

var authController = require("../controllers/authController");

var convoController = require("../controllers/conversationController");

router.use(authController.protect);
router.route("/").get(friendController.getAllFriends).post(friendController.createFriend);
router.route("/:id").get(friendController.getFriend).patch(friendController.updateFriend)["delete"](friendController.deleteFriend);
router.route("/friendRequest/:friendId").post(friendController.sendFriendRequest); // NEEDS TO BE REVISED IN THE FUTURE

router.route("/currentUser/allFriends").get(friendController.getMyFriends);
router.route("/friendRequests/myFriendRequests").get(friendController.getMyFriendRequests);
router.get("/isFriend/:id", friendController.isFriend); // Checks if a conversation exists with a friend

router.use("/checkConvo/:friendId", convoController.checkConvoExists); // Blocks or unblocks a user

module.exports = router;