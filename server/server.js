// REQUIRE PACKAGES
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
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

dotenv.config({ path: "./config.env" });
// REQUIRE APPLICATION
const app = require("./app");

// SETUP MONGOOSE CONNECT
// adds password in the database connection string
let db = process.env.DATABASE.replace("<db_password>", process.env.DB_PASSWORD);
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

// RUN SERVER
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "http://localhost:5173" } });

io.on("connection", (socket) => {
  console.log("A user connected!");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

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
