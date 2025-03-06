const express = require("express");
const router = express.Router();
const controller = require("../controllers/userConversationController");
const authController = require("../controllers/authController");

router.use(authController.protect);
router
  .route("/")
  .post(controller.createUserConversation)
  .get(controller.getAllUserConversation);

router
  .route("/:id")
  .get(controller.getUserConversation)
  .patch(controller.updateUserConversation)
  .delete(controller.deleteUserConversation);

module.exports = router;
