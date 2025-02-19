"use strict";

var express = require("express");

var router = express.Router();

var authController = require("../controllers/authController");

router.use("/isLoggedIn", authController.isLoggedIn);