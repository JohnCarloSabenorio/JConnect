const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
    isAdmin: {
      type: Boolean,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL PROPERTIES
userSchema.virtual("User").get(function () {
  return `${this.fname} ${this.lname}`;
});

// DOCUMENT MIDDLEWARES
userSchema.pre("save", function (next) {
  console.log("User is being saved...");
  next();
});

userSchema.post("save", function (doc, next) {
  console.log("SAVED DOCUMENT: ", doc);
  console.log(`${doc.username} is saved!`);
  next();
});

// QUERY MIDDLEWARES
userSchema.pre(/^find/, function (next) {
  this.find({ isAdmin: { $ne: true } });

  this.start = Date.now();
  next();
});

userSchema.post(/^find/, function (docs, next) {
  console.log(`This query took ${Date.now() - this.start} milliseconds to complete!`);
  console.log(docs);
  next();
});

const User = mongoose.model("user", userSchema);
module.exports = mongoose.model("User", userSchema);
