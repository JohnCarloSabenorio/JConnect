"use strict";

var mongoose = require("mongoose");

var validator = require("validator");

var bcrypt = require("bcrypt");

var crypto = require("crypto");

var _require = require("assert"),
    match = _require.match;
/* 
^ and $: Ensure the entire string is checked.
(?=.*[a-z]): At least one lowercase letter.
(?=.*[A-Z]): At least one uppercase letter.
(?=.*\d): At least one digit.
(?=.*[@$!%*?&]): At least one special character.
[A-Za-z\d@$!%*?&]{8,}: Only allows specified characters, with a minimum length of 8.
*/


var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "A user must have a username!"],
    unique: true,
    maxlength: [20, "A username must have less than or equal to 20 characters."]
  },
  role: {
    type: String,
    "enum": {
      values: ["user", "admin"],
      message: "Invalid user role! The valid roles are: user and admin."
    },
    "default": "user",
    select: false
  },
  email: {
    type: String,
    required: [true, "A user must have an email!"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email!"]
  },
  password: {
    type: String,
    required: [true, "A user must have a password!"],
    minlength: 8,
    select: false // This sets password to cannot be queried

  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    select: false
  },
  phone_number: {
    type: String,
    match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number."]
  },
  location: {
    type: String
  },
  bio: {
    type: String
  },
  passwordChangedAt: {
    type: Date,
    select: false
  },
  profilePicture: {
    "default": "default.png",
    type: String
  },
  profileBanner: {
    "default": "default.png",
    type: String
  },
  status: {
    type: String,
    "default": "offline",
    "enum": ["online", "away", "offline", "busy"]
  },
  lastActiveAt: {
    type: Date,
    "default": Date.now
  },
  isActive: {
    type: Boolean,
    "default": true,
    select: false
  },
  passwordResetToken: String,
  tokenExpirationDate: Date
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}); // VIRTUAL PROPERTIES

userSchema.virtual("profilePictureUrl").get(function () {
  if (!this.profilePicture) return null;

  if (this.profilePicture.startsWith("img/profileImages")) {
    return this.profilePicture;
  }

  return "img/profileImages/".concat(this.profilePicture);
}); // DOCUMENT MIDDLEWARES
// Removes unnecessary fields when creating a user

userSchema.set("toJSON", {
  transform: function transform(doc, ret) {
    delete ret.password;
    delete ret.role;
    delete ret.lastActiveAt;
    delete ret.updatedAt;
    delete ret.passwordChangedAt;
    return ret;
  }
}); // Hash password before saving

userSchema.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Saving user...");

          if (this.isModified("password")) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", next());

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(hashPassword(this.password, 12));

        case 5:
          this.password = _context.sent;
          this.passwordConfirm = undefined;
          next();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});
userSchema.pre("save", function (next) {
  if (this.isModified || !this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }

  next();
}); // QUERY MIDDLEWARES

userSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
}); // Appends the new unique contacts in the document

userSchema.post(/^find/, function (docs, next) {
  console.log("This query took ".concat(Date.now() - this.start, " milliseconds to complete!"));
  next();
});

function hashPassword(psword) {
  return regeneratorRuntime.async(function hashPassword$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("Hashing password...");
          _context2.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(psword, 12));

        case 3:
          return _context2.abrupt("return", _context2.sent);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
} // AGGREGATION MIDDLEWARES
// INSTANCE METHODS


userSchema.methods.correctPassword = function _callee2(candidatePassword, userPassword) {
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(candidatePassword, userPassword));

        case 2:
          return _context3.abrupt("return", _context3.sent);

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};

userSchema.methods.passwordChangedAfter = function (JWTDateIssued) {
  if (!this.passwordChangedAt) return false;
  var pwordChangedTime = this.passwordChangedAt.getTime() / 1000;
  return pwordChangedTime > JWTDateIssued;
};

userSchema.methods.createPasswordResetToken = function () {
  // Create random hexadecimal string
  var resetToken = crypto.randomBytes(64).toString("hex"); // Encrypt the reset token and store it in database

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex"); // Set the expiration date of the token

  this.tokenExpirationDate = Date.now() + 10 * 60 * 1000; // return unencrypted token

  return resetToken;
}; // DOCUMENT MIDDLEWARE


var userModel = mongoose.model("User", userSchema);
module.exports = userModel;