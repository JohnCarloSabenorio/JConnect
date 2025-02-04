const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");
const authController = require("../controllers/authController");
const friend = require("../models/friendModel");

// router
//   .route("/")
//   .get(friendController.getAllFriends)
//   .patch(friendController.updateFriends);

router.use(authController.protect);
router
  .route("/")
  .get(friendController.setUserBody, friendController.getAllFriends)
  .post(friendController.setUserFriendBody, friendController.addFriend);

router
  .route("/:id")
  .get(friendController.getFriend)
  .patch(friendController.updateFriend)
  .delete(friendController.deleteFriend);

// Blocks or unblocks a user

module.exports = router;
