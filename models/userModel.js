const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
/* 
^ and $: Ensure the entire string is checked.
(?=.*[a-z]): At least one lowercase letter.
(?=.*[A-Z]): At least one uppercase letter.
(?=.*\d): At least one digit.
(?=.*[@$!%*?&]): At least one special character.
[A-Za-z\d@$!%*?&]{8,}: Only allows specified characters, with a minimum length of 8.
*/
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "A user must have a username!"],
      unique: true,
      maxlength: [
        20,
        "A username must have less than or equal to 20 characters.",
      ],
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
      default: false,
    },
    email: {
      type: String,
      required: [true, "A user must have an email!"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email!"],
    },

    password: {
      type: String,
      required: [true, "A user must have a password!"],
      minlength: 8,
      select: false, // This sets password to cannot be queried
      validate: [
        validator.isStrongPassword,
        "User must enter a valid password! ({VALUE} is not a valid password!)",
      ],
    },
    passwordChangedAt: {
      type: Date,
    },
    profilePicture: {
      type: String,
    },
    status: {
      type: String,
      enum: ["online", "away", "offline", "busy"],
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

// VIRTUAL PROPERTIES
userSchema.virtual("fullname").get(function () {
  return `${this.fname} ${this.mname} ${this.lname}`;
});

// DOCUMENT MIDDLEWARES

// Hash password before saving
userSchema.pre("save", async function (next) {
  console.log("Saving user...");

  if (this.isModified("password")) {
    hashedPass = await hashPassword(this.password);
    this.password = hashedPass;
    this.passwordChangedAt = Date.now();
  }

  next();
});

// QUERY MIDDLEWARES
userSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

// Appends the new unique contacts in the document

userSchema.post(/^find/, function (docs, next) {
  console.log(
    `This query took ${Date.now() - this.start} milliseconds to complete!`
  );
  console.log(docs);
  next();
});

async function hashPassword(psword) {
  // console.log("User credentials: ", this);
  const pwordSalt = await bcrypt.genSalt(saltRounds);
  const pwordHash = await bcrypt.hash(psword, pwordSalt);
  // const isMatch = await bcrypt.compare(this.password, pwordHash);
  // console.log(isMatch);
  // console.log(`Password salt: ${pwordSalt}`);
  console.log(`Hashed password: ${pwordHash}`);
  return pwordHash;
}
// AGGREGATION MIDDLEWARES

// DOCUMENT MIDDLEWARE

module.exports = mongoose.model("User", userSchema);
