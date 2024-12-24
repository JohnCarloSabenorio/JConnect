const express = require("express");
const controller = require("./../controllers/userControlller");
const multer = require("multer");
const router = express.Router();
const upload = multer(); // this is used for multipart/form-data

router.route("/").get(controller.getAllUsers).post(controller.createUser);

// Modifies a user
router
  .route("/:id")
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

// Modify contacts of a user
router
  .route("/contacts/:id")
  .get(controller.getContacts)
  .patch(controller.addContact)
  .delete(controller.deleteContact);
module.exports = router;

// Blocks or unblocks a user
router.route("/contacts/:id/block").patch(controller.blockContact);
router.route("/contacts/:id/unblock").patch(controller.unblockContact);