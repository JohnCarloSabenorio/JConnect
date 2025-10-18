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
  origin: "http://localhost:5173",
  credentials: true // Allows cookies, HTTP auth, or client-side SSL certificates

}; // GLOBAL MIDDLEWARES

app.use(cors(corsOptions)); // Provides protection for common web vulnerabilities (XSS, clickjacking, sniffing attacks, etc...)

app.use(helmet());
app.use(express["static"]("".concat(__dirname, "\\public")));
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

app.use("/jconnect/api/v1/users", userRouter);
app.use("/jconnect/api/v1/message", messageRouter);
app.use("/jconnect/api/v1/friends", friendRouter);
app.use("/jconnect/api/v1/conversation", convoRouter);
app.use("/jconnect/api/v1/user-conversation", userConvoRouter);
app.use("/jconnect/api/v1/notification", notificationRouter); // This will handle undefined routes

app.all("*", function (req, res, next) {
  next(new AppError("Cannot find ".concat(req.originalUrl, " on the server!"), 404));
}); // Catches all errors in the application

app.use(globalErrorHandler); // EXPORT APPLICATION

module.exports = app;