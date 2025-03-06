"use strict";

var express = require("express");

var router = express.Router();

var controller = require("../controllers/userConversationController");

var authController = require("../controllers/authController");

router.use(authController.protect);
router.route("/").post(controller.createUserConversation).get(controller.getAllUserConversation);
router.route("/:id").get(controller.getUserConversation).patch(controller.updateUserConversation)["delete"](controller.deleteUserConversation);
module.exports = router;