const express = require("express");
const router = express.Router({ mergeParams: true });

const friendController = require("../controllers/friendController");
const authController = require("../controllers/authController");
const convoController = require("../controllers/conversationController");
router.use(authController.protect);

router
  .route("/")
  .get(friendController.getAllFriends)
  .post(friendController.createFriend);

router.get("/non-friends", friendController.getNonFriendUsers);

router
  .route("/:id")
  .get(friendController.getFriend)
  .patch(friendController.updateFriend)
  .delete(friendController.deleteFriend);

router
  .route("/friendRequest/:friendId")
  .post(friendController.sendFriendRequest);

router
  .route("/cancelRequest/:friendId")
  .delete(friendController.cancelFriendRequest);
router
  .route("/rejectRequest/:friendId")
  .delete(friendController.rejectFriendRequest);
router
  .route("/acceptRequest/:friendId")
  .patch(friendController.acceptFriendRequest);

// NEEDS TO BE REVISED IN THE FUTURE
router.route("/currentUser/allFriends").get(friendController.getMyFriends);
router
  .route("/friendRequests/myFriendRequests")
  .get(friendController.getMyFriendRequests);

router
  .route("/isRequestSent/:userId")
  .get(friendController.isRequestSentToUser);

router.route("/count/id").get(friendController.getFriendCount);

router
  .route("/isRequestReceived/:userId")
  .get(friendController.isRequestReceived);

router.get("/isFriend/:id", friendController.isFriend);
// Checks if a conversation exists with a friend
router.use("/checkConvo/:friendId", convoController.checkConvoExists);

// Blocks or unblocks a user

module.exports = router;
