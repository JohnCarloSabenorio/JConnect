"use strict";

var express = require("express");

var router = express.Router();

var controller = require("./../controllers/messageController");

var authController = require("./../controllers/authController");

router.route("/").get(authController.protect, controller.getAllMessages);
router.route("/:convoId").post(authController.protect, controller.initSenderConvo, controller.createMessage);
router.route("/:id").get(authController.protect, controller.getMessage).patch(authController.protect, controller.updateMessage)["delete"](authController.protect, controller.deleteMessage);
module.exports = router;