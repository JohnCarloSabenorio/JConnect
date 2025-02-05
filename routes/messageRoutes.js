const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("./../controllers/messageController");
const authController = require("./../controllers/authController");

router
  .route("/")
  .get(
    authController.protect,
    controller.initSenderConvo,
    controller.getAllMessages
  )
  .post(
    authController.protect,
    controller.initSenderConvo,
    controller.createMessage
  );

router
  .route("/:id")
  .get(authController.protect, controller.getMessage)
  .patch(authController.protect, controller.updateMessage)
  .delete(authController.protect, controller.deleteMessage);

module.exports = router;
