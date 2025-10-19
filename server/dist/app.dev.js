"use strict";

// REQUIRE PACKAGES
var express = require("express");

var morgan = require("morgan"); // The main application


var app = express();

var AppError = require("./utils/appError");

var globalErrorHandler = require("./controllers/errorController"); // DEFINED ROUTERS


var userRouter = require("./routes/userRoutes");

var messageRouter = require("./routes/messageRoutes");

var friendRouter = require("./routes/friendRoutes");

var convoRouter = require("./routes/conversationRoutes");

var userConvoRouter = require("./routes/userConversationRoutes");

var notificationRouter = require("./routes/notificationRoutes");

var rateLimit = require("express-rate-limit");

var helmet = require("helmet");

var mongoSanitize = require("express-mongo-sanitize");

var xssFilters = require("xss-filters");

var hpp = require("hpp");

var cookieParser = require("cookie-parser");

var cors = require("cors");

var path = require("path");

var corsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.LIVEHOST : process.env.LOCALHOST,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}; // GLOBAL MIDDLEWARES

app.use(cors(corsOptions)); // Provides protection for common web vulnerabilities (XSS, clickjacking, sniffing attacks, etc...)

app.use(helmet());
app.use("/img", express["static"](path.join(__dirname, "public/img"), {
  setHeaders: function setHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", process.env.NODE_ENV === "production" ? process.env.LIVEHOST : process.env.LOCALHOST);
  }
}));
app.use("/files", express["static"](path.join(__dirname, "public/files"), {
  setHeaders: function setHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", process.env.NODE_ENV === "production" ? process.env.LIVEHOST : process.env.LOCALHOST);
  }
}));
var limiter = rateLimit.rateLimit({
  windowMs: 60 * 60 * 1000,
  // Number of requests will be counted per hour
  limit: 100,
  // Maximum of 100 requests per hour
  message: "Too many requests! Please try again after 1 hour."
}); // app.use(limiter);
// Prevents NoSQL injection attacks

app.use(mongoSanitize()); // Removes $ and . characters
// Parses URL-encoded form data from POST requests

app.use(express.urlencoded({
  extended: true
})); // extended : true allows nested objects
// Parses JSON data from requests

app.use(express.json()); // Parses cookie headers

app.use(cookieParser());
app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
}); // ROUTES

app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/friends", friendRouter);
app.use("/api/v1/conversation", convoRouter);
app.use("/api/v1/user-conversation", userConvoRouter);
app.use("/api/v1/notification", notificationRouter); // This will handle undefined routes

app.all("*", function (req, res, next) {
  next(new AppError("Cannot find ".concat(req.originalUrl, " on the server!"), 404));
}); // Catches all errors in the application

app.use(globalErrorHandler); // EXPORT APPLICATION

module.exports = app;