// REQUIRE PACKAGES
const express = require("express");
const morgan = require("morgan");
// The main application
const app = express();
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
// DEFINED ROUTERS
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const friendRouter = require("./routes/friendRoutes");
const convoRouter = require("./routes/conversationRoutes");
const userConvoRouter = require("./routes/userConversationRoutes");


const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssFilters = require("xss-filters");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Allows cookies, HTTP auth, or client-side SSL certificates
};

// GLOBAL MIDDLEWARES
app.use(cors(corsOptions));

// Provides protection for common web vulnerabilities (XSS, clickjacking, sniffing attacks, etc...)
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // This will log http request information
}

const limiter = rateLimit.rateLimit({
  windowMs: 60 * 60 * 1000, // Number of requests will be counted per hour
  limit: 100, // Maximum of 100 requests per hour
  message: "Too many requests! Please try again after 1 hour.",
});

// app.use(limiter);

// Prevents NoSQL injection attacks
app.use(mongoSanitize()); // Removes $ and . characters

// Parses URL-encoded form data from POST requests
app.use(express.urlencoded({ extended: true })); // extended : true allows nested objects

// Parses JSON data from requests
app.use(express.json());

// Parses cookie headers
app.use(cookieParser());


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log("Server request time: " + req.requestTime);
  next();
});

// This will set the default directory for static files
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use("/jconnect/api/v1/users", userRouter);
app.use("/jconnect/api/v1/message", messageRouter);
app.use("/jconnect/api/v1/friends", friendRouter);
app.use("/jconnect/api/v1/conversation", convoRouter);
app.use("/jconnect/api/v1/user-conversation", userConvoRouter);

// This will handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on the server!`, 404));
});

// Catches all errors in the application
app.use(globalErrorHandler);

// EXPORT APPLICATION
module.exports = app;
