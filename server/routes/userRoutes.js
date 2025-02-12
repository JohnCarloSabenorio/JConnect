const express = require("express");

const authController = require("./../controllers/authController");
const controller = require("./../controllers/userControlller");
const convoRouter = require("./conversationRoutes");
const friendRouter = require("./friendRoutes");
/* 
const multer = require("multer");
const upload = multer(); // this is used for multipart/form-data
*/
const router = express.Router();

router.use("/:userId/conversation", convoRouter);
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/isLoggedIn").get(authController.isLoggedInBool);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

// router.use(authController.protect);

router.route("/convo/:userId");

router.route("/updatePassword").patch(authController.updatePassword);

router.route("/").get(controller.getAllUsers).post(controller.createUser);

router.route("/updateMe").patch(controller.updateMe);
router.route("/getMe").get(controller.getMe);
router.route("/deleteMe").delete(controller.deleteMe);
// Modifies a user
router
  .route("/:id")
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;
