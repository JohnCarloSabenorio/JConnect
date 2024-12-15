// REQUIRE PACKAGES
const mongoose = require("mongoose");
const dotenv = require("dotenv");
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
  })
  .catch((err) => {
    console.log("Database connection failed!");
    console.log(`Error: ${err}`);
  });

// RUN SERVER
const port = process.env.PORT||3000;
app.listen(port, () => {
  console.log(`Server listening at port ${port}...`);
});
