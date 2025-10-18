// REQUIRE PACKAGES
const dotenv = require("dotenv");
// Configures the path for environment variables
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");

const port = process.env.PORT || 4000;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.LIVEHOST
        : process.env.LOCALHOST,
  },
});

const ioController = require("./controllers/ioController");

// CATCHES SYNCHRONOUS ERRORS
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down the application...");

  if (process.env.NODE_ENV == "development") {
    console.log(err);
  } else {
    console.log(err.name, err.message);
  }
  process.exit(1);
});

// SETUP MONGOOSE CONNECT

// Adds password in the database connection string
let db = process.env.DATABASE.replace("<db_password>", process.env.DB_PASSWORD);

// Connects to the MongoDB database
mongoose
  .connect(db)
  .then((res) => {
    console.log("Database successfully connected!");
    console.log(`Host: ${res.connection.host}, DB: ${res.connection.name}`);
  })
  .catch((err) => {
    console.log("Database connection failed!");
    console.log(`Error: ${err}`);
  });

// WEBSOCKET CONNECTION AND HANDLERS

let onlineSockets = {};
io.on("connection", (socket) => {
  console.log("USER JOINED:", socket.handshake.auth.userId);

  const userId = socket.handshake.auth.userId;
  onlineSockets[userId] = socket;

  const userRoom = `user_${userId}`;
  console.log("user room:", userRoom);
  socket.join(userRoom);

  // Creates a room for every conversation the user is part of
  socket.on("join rooms", (data) => {
    // Check if the user is already in the room
    if (!socket.rooms.has(data)) {
      console.log("the room:", data);
      socket.join(data);
      console.log(`Socket ${socket.id} joined room ${data}`);
    } else {
      console.log("The user is already in the room!");
    }
  });

  // Disconnects the user
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // Change user status
  socket.on("change status", (data) => {
    data["actor"] = socket.handshake.auth.userId;
    ioController.changeUserStatus(io, socket, data);
  });

  // Sends real-time messages
  socket.on("chat message", (data) => {
    ioController.sendMessage(io, socket, data);
  });

  // Join the group conversation room

  // Adds the new user conversation in the sidebar of the invited user
  socket.on("invite groupchat", (data) => {
    const usersocket = onlineSockets[data.user];

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
  });

  // Chat a user
  socket.on("chat user", (data) => {
    const usersocket = onlineSockets[data.user];

    if (!socket.rooms.has(data.conversation)) {
      if (usersocket) {
        try {
          console.log(`${data.user} joined the conversation chuness`);
          usersocket.join(data.conversation);
        } catch (err) {
          console.error("Error joining room:", err);
        }
      }

      try {
        ioController.chatAUser(io, socket, data);
      } catch (err) {
        console.error("Error chatting a user:", err);
      }
    }
  });

  // Send notification
  socket.on("send notification", (data) => {
    data["actor"] = socket.handshake.auth.userId;

    ioController.sendNotification(io, socket, data);
  });

  socket.on("message react", (data) => {
    data["actor"] = socket.handshake.auth.userId;
    console.log("A user reacted to the message!");

    ioController.reactToMesage(io, socket, data);
  });

  socket.on("remove member", (data) => {
    data["actor"] = socket.handshake.auth.userId;
    ioController.removeMember(io, socket, data);
  });

  socket.on("create message", (data) => {
    data["actor"] = socket.handshake.auth.userId;
    ioController.createMessage(io, socket, data);
  });
  socket.on("update conversation", (data) => {
    data["actor"] = socket.handshake.auth.userId;
    ioController.updateConversation(io, socket, data);
  });

  socket.on("update nickname", (data) => {
    data["actor"] = socket.handshake.auth.userId;
    ioController.updateNickname(io, socket, data);
  });

  socket.on("leave group", (data) => {
    data["actor"] = socket.handshake.auth.userId;
    ioController.leaveConversation(io, socket, data);
  });
});

// RUN SERVER
server.listen(port, () => {
  console.log(`Server listening at port ${port}...`);
});

// SAFETY NET FOR ERRORS
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down the application...");
  if (process.env.NODE_ENV == "development") {
    console.log(err);
  } else {
    console.log(err.name, err.message);
  }
  server.close(() => {
    process.exit(1);
  });
});
