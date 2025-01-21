const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const handlerFactory = require("./handlerFactory.js");
// USER HANDLERS

exports.updateMe = catchAsync(async (req, res, next) => {
  // Check if the payload has password and password confirm
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "Please use a different endpoint for updating the password!",
        400
      )
    );

  console.log(`this is the body:`, req.body);
  // If not, update the user
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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    isActive: false,
  });
  res.status(204).json({
    status: "success",
    message: "Account successfully deleted!",
  });
});

exports.createUser = catchAsync(async (req, res) => {
  console.log(req.body);
  await User.create(req.body);
  res.status(200).json({
    status: "success",
    message: "Successfully created user",
  });
});

// USER CONTACT HANDLERS
exports.getContacts = catchAsync(async (req, res) => {
  const userContacts = await User.findById(req.params.id).select("contacts");

  if (!userContacts) {
    return next(
      new AppError(
        `Contacts of the user ${req.params.id} cannot be found!`,
        404
      )
    );
  }

  if (!userContacts) {
    res.status(404).json({
      status: "failed",
      message: "Cannot find user contacts!",
    });
  }

  console.log("USER CONTACTS:", userContacts);
  res.status(200).json({
    status: "success",
    data: userContacts,
  });
});

// NEED REVISION
exports.updateContacts = catchAsync(async (req, res) => {
  const newContacts = Array.isArray(req.body.contacts)
    ? req.body.contacts
    : [req.body.contacts];

  console.log("New contacts to be added: ", newContacts);

  updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: {
        contacts: { $each: newContacts },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    res.status(404).json({
      status: "failed",
      message: "User does not exist!",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully added contact!",
  });
});

exports.deleteContact = catchAsync(async (req, res) => {
  console.log(req.body);
  updatedUser = await User.findByIdAndUpdate(req.params.id, {
    $pull: {
      contacts: req.body.userId,
    },
  });
  console.log(updatedUser.contacts);
  res.status(204).json({
    status: "success",
    message: "Successfully deleted contact!",
  });
});

exports.blockContact = catchAsync(async (req, res) => {
  console.log(req.body);

  await User.findByIdAndUpdate(req.params.id, {
    $pull: {
      contacts: req.body.userId,
    },
  });

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        blockedUsers: req.body.userId,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Successfully blocked contact!",
    data: user,
  });
});

exports.unblockContact = catchAsync(async (req, res) => {
  console.log(req.body);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        blockedUsers: req.body.userId,
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Successfully unblocked contact!",
    data: user,
  });
});

// GENERIC HANDLERS
exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
