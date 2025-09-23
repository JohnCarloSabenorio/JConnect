const express = require("express");

const authController = require("./../controllers/authController");
const controller = require("./../controllers/userControlller");
const convoRouter = require("./conversationRoutes");

const router = express.Router({ mergeParams: true });

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/isLoggedIn").get(authController.isLoggedInBool);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router.route("/isTokenValid/:token").get(authController.isTokenValid);

// User conversation api with the id of a user
router.use("/:userId/conversation", convoRouter);

router.use(authController.protect);
router.route("/logout").get(authController.logout);

router.use("/allConvo", convoRouter);
router.route("/convo/:userId");

// This is for
router.route("/updatePassword").patch(authController.updatePassword);

router.route("/").get(controller.getAllUsers).post(controller.createUser);

router
  .route("/updateMe")
  .patch(controller.uploadImage, controller.resizeImage, controller.updateMe);
router.route("/getMe").get(controller.getMe);
router.route("/deleteMe").delete(controller.deleteMe);
// Modifies a user
router
  .route("/:id")
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;
