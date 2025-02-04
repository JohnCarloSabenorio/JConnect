"use strict";

var express = require("express");

var router = express.Router();

var convoController = require("../controllers/conversationController");

var authController = require("../controllers/authController");

router.route("/").get(convoController.getAllConversation).post(convoController.createConversation);
router.route("/:id").get(convoController.getConversation).patch(convoController.updateConversation)["delete"](convoController.deleteConversation);
module.exports = router;