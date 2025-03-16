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
router.patch("/archive/:id", controller.archiveConversation);
router.patch("/unarchive/:id", controller.unarchiveConversation);
router.get("/isArchived/:id", controller.userConvoIsArchived);
router.get("/getStatus/:id", controller.getUserConvoStatus);
module.exports = router;