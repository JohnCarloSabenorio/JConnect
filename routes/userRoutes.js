const express = require("express");

const authController = require("./../controllers/authController");
const controller = require("./../controllers/userControlller");
/* 
const multer = require("multer");
const upload = multer(); // this is used for multipart/form-data
*/
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router
  .route("/updatePassword")
  .patch(authController.protect, authController.updatePassword);

router
  .route("/")
  .get(authController.protect, controller.getAllUsers)
  .post(controller.createUser);

router.use(authController.protect);

router.route("/updateMe").patch(controller.updateMe);
router.route("/getMe").get(controller.getMe);
router.route("/deleteMe").delete(controller.deleteMe);
// Modifies a user
router
  .route("/:id")
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

// Modify contacts of a user
router
  .route("/contacts/")
  .get(controller.getContacts)
  .patch(controller.updateContacts)
  .delete(controller.deleteContact);
// Blocks or unblocks a user
router.route("/contacts/:id/block").patch(controller.blockContact);
router.route("/contacts/:id/unblock").patch(controller.unblockContact);

module.exports = router;
