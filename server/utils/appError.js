// Custom Error Handling Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    // Stores the HTTP status code
    this.statusCode = statusCode;

    this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";

    // This will check if the error occurred is predicted or unforeseen(a bug).
    this.isOperational = true;

    // Removes unnecessary parts in the error stack
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
