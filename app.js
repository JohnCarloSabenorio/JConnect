// REQUIRE PACKAGES
const express = require("express");
const morgan = require("morgan");
// The main application
const app = express();

// DEFINE ROUTERS
const userRouter = require("./routes/userRoutes");

// MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // This will log http request information
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log("Server request time: " + req.requestTime);
  next();
});

app.use(express.static(`${__dirname}/public`));

// ROUTES
app.get("/", (req, res) => {
  res.send("Successfully called a route!");
});
app.use("/jconnect/v1/users", userRouter);

// EXPORT APPLICATION
module.exports = app;
