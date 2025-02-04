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
  .delete(friendController.deleteFriend);

// Blocks or unblocks a user
// router.route("/block/:id").patch(friendController.blockUser);
// router.route("/unblock/:id").patch(friendController.unblockUser);

module.exports = router;
