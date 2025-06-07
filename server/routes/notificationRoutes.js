const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

router
  .route("/")
  .post(controller.createNotification)
  .get(controller.getAllNotifications);

router
  .route("/:id")
  .get(controller.getNotification)
  .patch(controller.updateNotification)
  .delete(controller.deleteNotification);
module.exports = router;
