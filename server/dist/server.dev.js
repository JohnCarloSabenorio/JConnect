"use strict";

// REQUIRE PACKAGES
var mongoose = require("mongoose");

var dotenv = require("dotenv");

var http = require("http");

var app = require("./app");

var port = process.env.PORT || 3000;
var server = http.createServer(app);

var io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

var ioController = require("./controllers/ioController"); // CATCHES SYNCHRONOUS ERRORS


process.on("uncaughtException", function (err) {
  console.log("UNCAUGHT EXCEPTION! Shutting down the application...");

  if (process.env.NODE_ENV == "development") {
    console.log(err);
  } else {
    console.log(err.name, err.message);
  }

  process.exit(1);
}); // Configures the path for environment variables

dotenv.config({
  path: "./config.env"
}); // SETUP MONGOOSE CONNECT
// Adds password in the database connection string

var db = process.env.DATABASE.replace("<db_password>", process.env.DB_PASSWORD); // Connects to the MongoDB database

mongoose.connect(db).then(function (res) {
  console.log("Database successfully connected!");
  console.log("Host: ".concat(res.connection.host, ", DB: ").concat(res.connection.name));
})["catch"](function (err) {
  console.log("Database connection failed!");
  console.log("Error: ".concat(err));
}); // WEBSOCKET CONNECTION AND HANDLERS

var onlineSockets = {};
io.on("connection", function (socket) {
  console.log("USER JOINED:", socket.handshake.auth.userId);
  var userId = socket.handshake.auth.userId;
  onlineSockets[userId] = socket;
  var userRoom = "user_".concat(userId);
  console.log("user room:", userRoom);
  socket.join(userRoom); // Creates a room for every conversation the user is part of

  socket.on("join rooms", function (data) {
    // Check if the user is already in the room
    if (!socket.rooms.has(data)) {
      console.log("the room:", data);
      socket.join(data);
      console.log("Socket ".concat(socket.id, " joined room ").concat(data));
    } else {
      console.log("The user is already in the room!");
    }
  }); // Disconnects the user

  socket.on("disconnect", function () {
    console.log("A user disconnected");
  }); // Sends real-time messages

  socket.on("chat message", function (data) {
    ioController.sendMessage(io, socket, data);
  }); // Join the group conversation room
  // Adds the new user conversation in the sidebar of the invited user

  socket.on("invite groupchat", function (data) {
    var usersocket = onlineSockets[data.user];

    if (usersocket) {
      try {
        usersocket.join(data.conversation);
      } catch (err) {
        console.error("Error joining room:", err);
      }
    }

    try {
      ioController.inviteToGroupChat(io, socket, data);
    } catch (err) {
      console.error("Error in inviteToGroupChat:", err);
    }
  }); // Send notification

  socket.on("send notification", function (data) {
    data["actor"] = socket.handshake.auth.userId;
    console.log("A user sent a notification!", socket.handshake.auth.userId);
    console.log("notification data:", data);
    ioController.sendNotification(io, socket, data);
  });
  socket.on("message react", function (data) {
    data["actor"] = socket.handshake.auth.userId;
    console.log("A user reacted to the message!");
    ioController.reactToMesage(io, socket, data);
  });
  socket.on("remove member", function (data) {
    data["actor"] = socket.handshake.auth.userId;
    ioController.removeMember(io, socket, data);
  });
  socket.on("create message", function (data) {
    data["actor"] = socket.handshake.auth.userId;
    ioController.createMessage(io, socket, data);
  });
  socket.on("update conversation", function (data) {
    data["actor"] = socket.handshake.auth.userId;
    ioController.updateConversation(io, socket, data);
  });
}); // RUN SERVER

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