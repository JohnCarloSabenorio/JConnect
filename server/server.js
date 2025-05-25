// REQUIRE PACKAGES
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
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

// Configures the path for environment variables
dotenv.config({ path: "./config.env" });

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
io.on("connection", (socket) => {
  console.log("A user connected!");

  // Creates a room for every conversation the user is part of
  socket.on("join rooms", (data) => {
    // Check if the user is already in the room
    if (!socket.rooms.has(data)) {
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

  // Sends real-time messages
  socket.on("chat message", (data) => {
    ioController.sendMessage(io, socket, data);
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
