const User = require("./../models/userModel");
const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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
  const token = signToken(newUser._id);
  res.status(200).json({
    status: "success",
    token,
    message: "user successfully created!",
    data: newUser,
  });
});

exports.login = async (req, res, next) => {
  // 1. Check if password or email exists
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide your email and password!", 400));
  }

  // 2. Check if user exists or if the password is correct.
  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  // bcrypt.compare is dependent on the user existing and may cause runtime error if done in a variable.
  if (!user || !user.correctPassword(password, user.password)) {
    return next(new AppError("Invalid email or password", 401));
  }
  // 3. Create Token and send response

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};

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
  console.log("decoded token: ");
  console.log(decoded);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user with this token no longer exists.", 401)
    );
  }

  // 4. Check if user changed password after the token was issued
  console.log(currentUser.passwordChangedAfter(decoded.iat));
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(
        "The user recently changed his/her password! Please log in again.",
        401
      )
    );
  }
  next();
});
