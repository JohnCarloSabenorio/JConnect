// REQUIRE PACKAGES
const express = require("express");
const morgan = require("morgan");
const app = express();
// DEFINE ROUTERS

// MIDDLEWARES

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
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
// EXPORT APPLICATION
module.exports = app;
