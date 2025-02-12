// REQUIRE PACKAGES
const express = require("express");
const morgan = require("morgan");
// The main application
const app = express();
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
// DEFINE ROUTERS
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const friendRouter = require("./routes/friendRoutes");
const convoRouter = require("./routes/conversationRoutes");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssFilters = require("xss-filters");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// GLOBAL MIDDLEWARES
app.use(cors(corsOptions));
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // This will log http request information
}

const limiter = rateLimit.rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: "Too many requests! Please try again after 1 hour.",
});

// app.use(limiter);
// Data sanitization against NoSQL Query injection
app.use(mongoSanitize());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log("Server request time: " + req.requestTime);
  next();
});

app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use("/jconnect/api/v1/users", userRouter);
app.use("/jconnect/api/v1/message", messageRouter);
app.use("/jconnect/api/v1/friends", friendRouter);
app.use("/jconnect/api/v1/conversation", convoRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

// EXPORT APPLICATION
module.exports = app;
