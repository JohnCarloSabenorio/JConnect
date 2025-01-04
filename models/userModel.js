const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
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

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password!"],
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Your passwords do not match! Please try again.",
      },
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
    this.passwordConfirm = undefined;
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
  return await bcrypt.hash(psword, 12);
}
// AGGREGATION MIDDLEWARES

// INSTANCE METHODS

userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function(JWTDateIssued){
  const pwordChangedTime =  this.passwordChangedAt.getTime() / 1000;  
  return pwordChangedTime > JWTDateIssued;
};

// DOCUMENT MIDDLEWARE
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
