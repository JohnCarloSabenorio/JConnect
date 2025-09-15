const User = require("./../models/userModel");
const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");

// Generates a JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSignToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Create options for the cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // 24 Hours
    ),
    httpOnly: true,
    // sameSite: "None",
    // domain: "localhost",
    // path: "/",
  };

  // If environment is in production, use https
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // Stores the JWT token in a cookie
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    message: "user successfully logged in!",
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // Create user
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Sign token (This will log the user in after signing up)
  createSignToken(newUser, 200, res);
});

exports.login = async (req, res, next) => {
  // 1. Check if password or email exists
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide your email and password!", 400));
  }

  // 2. Check if user exists or if the password is correct.
  const user = await User.findOneAndUpdate(
    { email },
    {
      status: "online",
    }
  ).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }
  // 3. Create Token and send response
  createSignToken(user, 200, res);
};

exports.logout = async (req, res) => {
  console.log("the req user:", req.user);
  console.log("user logged out...");
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    {
      status: "offline",
    }
  );

  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
};

// Restricts the route to only those who are logged in!
exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get token and check if it exists
  let token;

  // Check the cookie instead of the authorization header in case it is missing (might be due to cross origin restrictions)
  if (req.headers.cookie) {
    token = req.headers.cookie.replace("jwt=", "");
  } else {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
  }

  // If the JWT does not exist, then the user is not logged in
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user with this token no longer exists.", 401)
    );
  }

  // 4. Check if user changed password after the token was issued
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(
        "The user recently changed his/her password! Please log in again.",
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

// Restricts the route according to specific roles
exports.restrictsTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action!", 403)
      );
    }
    next();
  };
};

// Sends email to the user if they forgot their password.
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("The user with this email does not exist!", 404));
  }

  // 2. Generate token and store encrypted token in the database
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Compose message
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/jconnect/v1/users/resetPassword/${resetToken}`;
  const message = `Please send a PATCH request to this url: ${resetURL}. \n if you didn't forget your password, please ignore this message.`;

  // 4. send email

  try {
    await sendEmail({
      email: user.email,
      subject: "Test email",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset token sent to the email of the user!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.tokenExpirationDate = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("Email failed to send! Please try again later.", 500)
    );
  }
});

// Resets the password of the user
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. hash token so that it matches the one in the db
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2. Get user based on token
  const user = await User.findOne({
    passwordResetToken: resetToken,
    tokenExpirationDate: {
      $gt: Date.now(),
    },
  });

  // 3. If token has not expired and there is a user, set the new password
  if (!user) {
    return next(new AppError("The token is invalid or expired!", 404));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.tokenExpirationDate = undefined;
  await user.save();

  // 4. Log the user in, send JWT to the client
  res.status(200).json({
    status: "success",
    token: "token",
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { newPassword, confirmNewPassword, currentPassword } = req.body;
  const errorMessages = [];

  console.log("the bodehh", req.body);
  // 1. Get user from collection
  console.log("the req user:", req.user);
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new AppError("User does not exist!", 404));
  }
  // 2. Check if the current password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    errorMessages.push("Your password is not correct! Please try again.");
  }

  // 3. Check if the password is atleast 8 characters long
  if (newPassword.length < 8) {
    errorMessages.push("Password must be at least 8 characters long.");
  }

  // 4. Check if the password contains atleast 1 uppercase, 1 lowercase, 1 digit, and 1 special character
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;
  if (!regex.test(req.body.newPassword)) {
    errorMessages.push(
      "Password must contain atleast 1 uppercase, 1 lowercase, 1 digit, and 1 special character."
    );
  }
  // 5. Check if the password and confirm password matches

  if (newPassword != confirmNewPassword) {
    errorMessages.push("Passwords provided must match.");
  }

  // 6. If there is at least 1 error message, return an error
  if (errorMessages.length > 0) {
    return res.status(400).json({
      status: "failed",
      message: "Failed to update user password!",
      errorMessages,
    });
  }

  // 7. Save the password if all the conditions are met
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmNewPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "User password successfully updated!",
  });
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // 1. Get the decoded cookie
  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
  } catch (err) {
    next(new AppError("JWT is expired."));
  }

  // 2. Check if the user still exists
  let currentUser = await User.findById(decoded.id);
  currentUser.profilePicture = `img/profileImages/${currentUser.profilePicture}`;

  if (!currentUser) {
    next(new AppError("User no longer exists!", 404));
  }

  // 3. Check if the user changed his/her password
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    next(new AppError("User changed his/her password!", 404));
  }

  // 4. set req.locals.user equal to the currentUser
  res.locals.user = currentUser;
  // 5. go to the next middleware
  next();
});

exports.isLoggedInBool = catchAsync(async (req, res, next) => {
  // 1. Get the decoded cookie
  console.log("AHH");
  if (!req.cookies.jwt) {
    console.log("HE");
    return res.status(404).json({
      status: "failed",
      message: "JWT not present!",
    });
  }
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  // 2. Check if the user still exists
  let currentUser = await User.findById(decoded.id);
  currentUser.profilePicture = `img/profileImages/${currentUser.profilePicture}`;

  if (!currentUser) {
    next(new AppError("User no longer exists!", 404));
  }

  // 3. Check if the user changed his/her password
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    next(new AppError("User changed his/her password!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User is logged in",
    currentUser,
  });
});
