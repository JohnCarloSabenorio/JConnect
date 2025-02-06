const express = require("express");
const router = express.Router({ mergeParams: true });
const friendController = require("../controllers/friendController");
const authController = require("../controllers/authController");
const friend = require("../models/friendModel");

router.use(authController.protect);

router
  .route("/")
  .get(friendController.getAllFriends)
  .post(friendController.createFriend);

router
  .route("/:id")
  .get(friendController.getFriend)
  .patch(friendController.updateFriend)
  .delete(friendController.deleteFriend);

router
  .route("/friendRequest/:friendId")
  .post(friendController.sendFriendRequest);


// NEEDS TO BE REVISED IN THE FUTURE
router.route("/currentUser/allFriends").get(friendController.getMyFriends);
router.route("/friendRequests/myFriendRequests").get(friendController.getMyFriendRequests);
// Blocks or unblocks a user

module.exports = router;
