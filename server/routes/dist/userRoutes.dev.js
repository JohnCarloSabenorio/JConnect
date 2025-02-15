"use strict";

var express = require("express");

var authController = require("./../controllers/authController");

var controller = require("./../controllers/userControlller");

var convoRouter = require("./conversationRoutes");

var friendRouter = require("./friendRoutes");
/* 
const multer = require("multer");
const upload = multer(); // this is used for multipart/form-data
*/


var router = express.Router();
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.use("/:userId/conversation", convoRouter);
router.route("/isLoggedIn").get(authController.isLoggedInBool);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword); // router.use(authController.protect);

router.route("/convo/:userId");
router.route("/updatePassword").patch(authController.updatePassword);
router.route("/").get(controller.getAllUsers).post(controller.createUser);
router.route("/updateMe").patch(controller.updateMe);
router.route("/getMe").get(controller.getMe);
router.route("/deleteMe")["delete"](controller.deleteMe); // Modifies a user

router.route("/:id").get(controller.getUser).patch(controller.updateUser)["delete"](controller.deleteUser);
module.exports = router;