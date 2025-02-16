"use strict";

var express = require("express");

var router = express.Router({
  mergeParams: true
}); // mergeParams is needed to pass in parameters from a subrouter.

var convoController = require("../controllers/conversationController");

var authController = require("../controllers/authController");

var messageRouter = require("./messageRoutes");

router.use("/:convoId/message", messageRouter);
router.use(authController.protect);
router.route("/member/:convoId").post(convoController.addMember)["delete"](convoController.removeMember);
router.route("/").get(convoController.getAllConversation).post(convoController.createConversation);
router.route("/:id").get(convoController.getConversation).patch(convoController.updateConversation)["delete"](convoController.deleteConversation);
router.route("/");
module.exports = router;