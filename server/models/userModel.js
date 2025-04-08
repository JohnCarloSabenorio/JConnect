const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
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
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Invalid user role! The valid roles are: user and admin.",
      },
      default: "user",
      select: false,
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
      select: false,
    },
    profilePicture: {
      type: String,
    },
    status: {
      type: String,
      enum: ["online", "away", "offline", "busy"],
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordResetToken: String,
    tokenExpirationDate: Date,
  },
  {
    timestamps: true,
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
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified || !this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
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
  next();
});

async function hashPassword(psword) {
  console.log("Hashing password...");
  return await bcrypt.hash(psword, 12);
}
// AGGREGATION MIDDLEWARES

// INSTANCE METHODS
userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  // bcrypt.compare is dependent on the user existing and may cause runtime error if done in a variable.
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTDateIssued) {
  if (!this.passwordChangedAt) return false;
  const pwordChangedTime = this.passwordChangedAt.getTime() / 1000;
  return pwordChangedTime > JWTDateIssued;
};

userSchema.methods.createPasswordResetToken = function () {
  // Create random hexadecimal string
  const resetToken = crypto.randomBytes(64).toString("hex");

  // Encrypt the reset token and store it in database
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration date of the token
  this.tokenExpirationDate = Date.now() + 10 * 60 * 1000;
  // return unencrypted token
  return resetToken;
};

// DOCUMENT MIDDLEWARE
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
