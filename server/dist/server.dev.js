"use strict";

// REQUIRE PACKAGES
var mongoose = require("mongoose");

var dotenv = require("dotenv");

var http = require("http");

var _require = require("socket.io"),
    Server = _require.Server; // CATCHES SYNCHRONOUS ERRORS


process.on("uncaughtException", function (err) {
  console.log("UNCAUGHT EXCEPTION! Shutting down the application...");

  if (process.env.NODE_ENV == "development") {
    console.log(err);
  } else {
    console.log(err.name, err.message);
  }

  process.exit(1);
});
dotenv.config({
  path: "./config.env"
}); // REQUIRE APPLICATION

var app = require("./app"); // SETUP MONGOOSE CONNECT
// adds password in the database connection string


var db = process.env.DATABASE.replace("<db_password>", process.env.DB_PASSWORD);
mongoose.connect(db).then(function (res) {
  console.log("Database successfully connected!");
  console.log("Host: ".concat(res.connection.host, ", DB: ").concat(res.connection.name));
})["catch"](function (err) {
  console.log("Database connection failed!");
  console.log("Error: ".concat(err));
}); // RUN SERVER

var port = process.env.PORT || 3000;
var server = http.createServer(app);

var io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

io.on("connection", function (socket) {
  console.log("A user connected!");
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});
server.listen(port, function () {
  console.log("Server listening at port ".concat(port, "..."));
}); // SAFETY NET FOR ERRORS

process.on("unhandledRejection", function (err) {
  console.log("UNHANDLED REJECTION! Shutting down the application...");

  if (process.env.NODE_ENV == "development") {
    console.log(err);
  } else {
    console.log(err.name, err.message);
  }

  server.close(function () {
    process.exit(1);
  });
});