const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");
const authController = require("../controllers/authController");

router.use(authController.protect);
router
  .route("/")
  .post(controller.createNotification)
  .get(controller.getAllNotifications);

router.patch("/update-user-notifs", controller.updateAllUserNotifications);

router
  .route("/:id")
  .get(controller.getNotification)
  .patch(controller.updateNotification)
  .delete(controller.deleteNotification);

module.exports = router;
