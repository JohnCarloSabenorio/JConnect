const express = require("express");
const controller = require("./../controllers/userControlller");
const multer = require("multer");
const router = express.Router();
const upload = multer(); // this is used for multipart/form-data

router
  .route("/")
  .get(controller.getAllUsers)
  .post(controller.createUser);

module.exports = router;
