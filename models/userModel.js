mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "A user must have a username!"],
    unique: true,
  },
  fname: {
    type: String,
    required: [true, "A user must have a first name!"],
  },
  mname: {
    type: String,
  },
  lname: {
    type: String,
    required: [true, "A user must have a last name!"],
  },
});

const User = mongoose.model("user", userSchema);

const testUser = new User({
  username: "bluem",
  fname: "John",
  lname: "Doe",
});

testUser
  .save()
  .then((res) => {
    console.log("User successfully created!");
  })
  .catch((err) => {
    console.log("User creation failed!");
    console.log(`Error: ${err}`);
  });
