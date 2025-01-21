const User = require("./../models/userModel");
const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");

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
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // If environment is in production, use https
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // Create the cookie
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    message: "user successfully created!",
    data: user,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  // Create user

  const newUser = await User.create({
    username: req.body.username,
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // Sign token
  createSignToken(newUser, 200, res);
});

exports.login = async (req, res, next) => {
  // 1. Check if password or email exists
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide your email and password!", 400));
  }

  // 2. Check if user exists or if the password is correct.
  const user = await User.findOne({ email }).select("+password");

  // bcrypt.compare is dependent on the user existing and may cause runtime error if done in a variable.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }
  // 3. Create Token and send response
  createSignToken(user, 200, res);
};

// Restricts the route to only those who are logged in!
exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

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
    console.log("CURRENT USER LOGGED IN: ", req.user);
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

  console.log("RESET TOKEN:", resetToken);

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
  console.log("HASHED TOKEN:", resetToken);

  // 2. Get user based on token
  const user = await User.findOne({
    passwordResetToken: resetToken,
    tokenExpirationDate: {
      $gt: Date.now(),
    },
  });

  console.log("USER: ", user);

  // 3. If token has not expired and there is a user, set the new password
  if (!user) {
    console.log("USER DOES NOT EXIST!");
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
  // 1. Get user from collection
  const user = await User.findById(req.user._id).select("+password");
  // 2. Check if POSTed current password is correct
  if (!user) {
    return next(new AppError("User does not exist!", 404));
  }

  if (!(await user.correctPassword(req.body.currentPassword, user.password)))
    return next(
      new AppError("Your password is not correct! Please try again.", 400)
    );

  // 3. If correct, update the password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmNewPassword;
  await user.save();

  createSignToken(user, 200, res);
});
