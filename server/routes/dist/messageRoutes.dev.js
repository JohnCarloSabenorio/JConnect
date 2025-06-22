"use strict";

var express = require("express");

var router = express.Router({
  mergeParams: true
});

var controller = require("./../controllers/messageController");

var authController = require("./../controllers/authController");

router.route("/").get(authController.protect, controller.initSenderConvo, controller.getAllMessages).post(authController.protect, controller.uploadImages, controller.resizeImages, controller.initSenderConvo, controller.createMessage);
router.route("/:id").get(authController.protect, controller.getMessage).patch(authController.protect, controller.updateMessage)["delete"](authController.protect, controller.deleteMessage);
router.use(authController.protect);
router.post("/unreact-to-message/:messageId", controller.unreactToMessage);
router.post("/react-to-message/:messageId", controller.reactToMessage);
module.exports = router;