const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const Friend = require("./../models/friendModel.js");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const handlerFactory = require("./handlerFactory.js");
// USER HANDLERS

// Update the data of the current user
exports.updateMe = catchAsync(async (req, res, next) => {
  // Check if the payload has password and password confirm
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "Please use a different endpoint for updating the password!",
        400
      )
    );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  console.log("Updated:", updatedUser);
  res.status(200).json({
    status: "success",
    message: "Information successfully updated!",
    data: updatedUser,
  });
});

// Get the data of the current user
exports.getMe = catchAsync(async (req, res, next) => {
  console.log("CURRENT ID:", req.user.id);
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    return next(
      new AppError(`User not found with the id of: ${req.user.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    message: "User successfully retrieved!",
    data: currentUser,
  });
});

// Delete the current user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    isActive: false,
  });
  res.status(204).json({
    status: "success",
    message: "Account successfully deleted!",
  });
});

// Create a new user
exports.createUser = catchAsync(async (req, res) => {
  console.log(req.body);
  await User.create(req.body);
  res.status(200).json({
    status: "success",
    message: "Successfully created user",
  });
});

// GENERIC HANDLERS
exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
