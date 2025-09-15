"use strict";

var express = require("express");

var router = express.Router({
  mergeParams: true
});

var controller = require("./../controllers/messageController");

var authController = require("./../controllers/authController");

router.use(authController.protect);
router.route("/").get(controller.initSenderConvo, controller.getAllMessages).post(controller.uploadImages, controller.resizeImages, controller.createMessage);
router.route("/:id").get(controller.getMessage).patch(controller.updateMessage)["delete"](controller.deleteMessage);
router.post("/unreact-to-message/:messageId", controller.unreactToMessage);
router.post("/react-to-message/:messageId", controller.reactToMessage);
router.get("/get-top-emojis/:messageId", controller.getTopMessageEmojis);
router.get("/get-all-reactions/:messageId", controller.getAllReactions);
module.exports = router;