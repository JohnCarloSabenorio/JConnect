"use strict";

// REQUIRE PACKAGES
var express = require("express");

var morgan = require("morgan"); // The main application


var app = express();

var AppError = require("./utils/appError");

var globalErrorHandler = require("./controllers/errorController"); // DEFINE ROUTERS


var userRouter = require("./routes/userRoutes");

var messageRouter = require("./routes/messageRoutes");

var friendRouter = require("./routes/friendRoutes");

var convoRouter = require("./routes/conversationRoutes");

var rateLimit = require("express-rate-limit");

var helmet = require("helmet");

var mongoSanitize = require("express-mongo-sanitize");

var xssFilters = require("xss-filters");

var hpp = require("hpp");

var cookieParser = require("cookie-parser");

var cors = require("cors");

var corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
}; // GLOBAL MIDDLEWARES

app.use(cors(corsOptions));
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // This will log http request information
}

var limiter = rateLimit.rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: "Too many requests! Please try again after 1 hour."
}); // app.use(limiter);
// Data sanitization against NoSQL Query injection

app.use(mongoSanitize());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  console.log("Server request time: " + req.requestTime);
  next();
});
app.use(express["static"]("".concat(__dirname, "/public"))); // ROUTES

app.use("/jconnect/api/v1/users", userRouter);
app.use("/jconnect/api/v1/message", messageRouter);
app.use("/jconnect/api/v1/friends", friendRouter);
app.use("/jconnect/api/v1/conversation", convoRouter);
app.all("*", function (req, res, next) {
  next(new AppError("Cannot find ".concat(req.originalUrl, " on the server!"), 404));
});
app.use(globalErrorHandler); // EXPORT APPLICATION

module.exports = app;