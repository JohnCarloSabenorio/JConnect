// Create function for sending error for development
const AppError = require("./../utils/appError");
// Create a function to handle cast errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Create a function to handle duplicate field errors
const handleDuplicateFieldDB = (err) => {
  const message = `Duplicate field detected. ${err.keyValue.username} already exists`;
  return new AppError(message, 400);
};

// Create a function to handle validation errors
const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join(" | ");
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please try again!", 401);

const handleTokenExpiredError = () =>
  new AppError("Your session has expired! Please log in again.", 401);
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
// Create function for sending error for production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong!",
    });
  }
};

// Export global error handler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV.trim() == "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() == "production") {
    let error = { ...err };
    // handle cast errors
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code == 11000) error = handleDuplicateFieldDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleTokenExpiredError();
    // ADD ERROR FOR JWTERROR AND EXPIRED TOKEN ERROR
    // handle duplicates in db
    sendErrorProd(error, res);
  }
};
