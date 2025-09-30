"use strict";

var express = require("express");

var router = express.Router({
  mergeParams: true
});

var controller = require("../controllers/userConversationController");

var authController = require("../controllers/authController");

router.use(authController.protect);
router.route("/").post(controller.createUserConversation).get(controller.getAllUserConversation);
router.route("/:id").get(controller.getUserConversation).patch(controller.updateUserConversation)["delete"](controller.deleteUserConversation);
router.get("/isArchived/:id", controller.userConvoIsArchived);
router.get("/getStatus/:id", controller.getUserConvoStatus);
router.get("/conversation-name/:convoId", controller.getConversationName);
router.get("/get-names-nicknames/:convoId", controller.getUserNamesAndNicknames);
router.get("/get-convo-with-user/:userId", controller.getConversationWithUser);
router.patch("/archive/:id", controller.archiveConversation);
router.patch("/unarchive/:id", controller.unarchiveConversation);
router.patch("/archive/:id", controller.blockConversation);
router.patch("/unarchive/:id", controller.unblockConversation);
router.patch("/activate/:userConvoId", controller.activateUserConversation);
module.exports = router;