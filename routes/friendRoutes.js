const express = require("express");
const router = express.Router({ mergeParams: true });
const friendController = require("../controllers/friendController");
const authController = require("../controllers/authController");
const friend = require("../models/friendModel");

router.use(authController.protect);

// get all friends need to be improved
router
  .route("/")
  .get(friendController.getAllFriends)
  .post(friendController.initUserFriendBody, friendController.createFriend);

router
  .route("/:id")
  .get(friendController.getFriend)
  .patch(friendController.updateFriend)
  .delete(friendController.deleteFriend);

// Blocks or unblocks a user

module.exports = router;
