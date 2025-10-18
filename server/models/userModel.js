const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { match } = require("assert");
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
    },
    password: {
      type: String,
      select: false, // This sets password to cannot be queried
    },

    passwordConfirm: {
      type: String,
      select: false,
    },

    phone_number: {
      type: String,
    },

    location: {
      type: String,
    },

    bio: { type: String },

    passwordChangedAt: {
      type: Date,
      select: false,
    },
    profilePicture: {
      default: "default.png",
      type: String,
    },
    profileBanner: {
      default: "default.jpg",
      type: String,
    },
    status: {
      type: String,
      default: "offline",
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL PROPERTIES
userSchema.virtual("profilePictureUrl").get(function () {
  if (!this.profilePicture) return null;
  if (this.profilePicture.startsWith("img/profileImages")) {
    return this.profilePicture;
  }
  return process.env.NODE_ENV === "production"
    ? `https://jconnect-server.onrender.com/img/profileImages/${this.profilePicture}`
    : `img/profileImages/${this.profilePicture}`;
});

userSchema.virtual("profileBannerUrl").get(function () {
  if (!this.profileBanner) return null;
  if (this.profileBanner.startsWith("img/profileBanners"))
    return this.profileBanner;

  return `img/profileBanners/${this.profileBanner}`;
});
// DOCUMENT MIDDLEWARES

// Removes unnecessary fields when creating a user
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.role;
    delete ret.lastActiveAt;
    delete ret.updatedAt;
    delete ret.passwordChangedAt;
    return ret;
  },
});

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
