const express = require("express");

const router = express.Router();
const convoController = require("../controllers/conversationController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(convoController.getAllConversation)
  .post(convoController.createConversation);

router
  .route("/:id")
  .get(convoController.getConversation)
  .patch(convoController.updateConversation)
  .delete(convoController.deleteConversation);
module.exports = router;
