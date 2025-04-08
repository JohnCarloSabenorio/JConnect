"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AppError = require("./../utils/appError"); // Create a function to handle cast errors


var handleCastErrorDB = function handleCastErrorDB(err) {
  var message = "Invalid ".concat(err.path, ": ").concat(err.value);
  return new AppError(message, 400);
}; // Create a function to handle duplicate field errors


var handleDuplicateFieldDB = function handleDuplicateFieldDB(err) {
  var message = "Duplicate field detected. ".concat(err.keyValue.username, " already exists");
  return new AppError(message, 400);
}; // Create a function to handle validation errors


var handleValidationErrorDB = function handleValidationErrorDB(err) {
  var message = Object.values(err.errors).map(function (el) {
    return el.message;
  }).join(" | ");
  return new AppError(message, 400);
}; // Invalid JWT (Possibly tampered or is not signed with the server's JWT Secret)


var handleJWTError = function handleJWTError() {
  return new AppError("Invalid token. Please try again!", 401);
}; // Expired token


var handleTokenExpiredError = function handleTokenExpiredError() {
  return new AppError("Your session has expired! Please log in again.", 401);
};

var sendErrorDev = function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}; // Create function for sending error for production


var sendErrorProd = function sendErrorProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong!"
    });
  }
}; // Export global error handler


module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error"; // This will send detailed error messages if the server is in development

  if (process.env.NODE_ENV.trim() == "development") {
    sendErrorDev(err, res);
  } // This will send generic error messages if the server is in production
  else if (process.env.NODE_ENV.trim() == "production") {
      var error = _objectSpread({}, err); // handle cast errors


      if (err.name === "CastError") error = handleCastErrorDB(err);
      if (err.code == 11000) error = handleDuplicateFieldDB(err);
      if (err.name === "ValidationError") error = handleValidationErrorDB(err);
      if (err.name === "JsonWebTokenError") error = handleJWTError();
      if (err.name === "TokenExpiredError") error = handleTokenExpiredError(); // ADD ERROR FOR JWTERROR AND EXPIRED TOKEN ERROR
      // handle duplicates in db

      sendErrorProd(error, res);
    }
};