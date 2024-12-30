const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
// USER HANDLERS
exports.getAllUsers = catchAsync(async (req, res) => {
  features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields();
  const users = await features.query;
  res.status(200).json({
    status: "success",
    message: "Successfully retrieved all users",
    data: users,
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

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.find(req.params.id);

  if (!user) {
    return next(
      new AppError(`No user found with the id of ${req.params.id}`, 404)
    );
  }

  console.log(user);
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  console.log("Headers:", req.headers); // Logs headers to verify content type
  console.log("Request body:", req.body); // Logs the parsed body
  updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    res.status(404).json({
      status: "failed",
      message: "User does not exist!",
    });
  }

  updatedUser.set(req.body); // This applies changes to the user document
  await updatedUser.save();

  const { password, passwordChangedAt, ...userWithoutSensitiveData } =
    updatedUser.toObject();

  res.status(200).json({
    status: "success",
    message: "Successfully updated user!",
    data: userWithoutSensitiveData,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  console.log("User deleted!");
  res.status(204).json({
    status: "success",
    message: "Successfully deleted user!",
    data: null,
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

exports.addContact = catchAsync(async (req, res) => {
  const newContacts = Array.isArray(req.body.contacts)
    ? req.body.contacts
    : [req.body.contacts];

  console.log("New contacts to be added: ", newContacts);

  updatedUser = await User.findByIdAndUpdate(
    req.params.id,
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
    data: updatedUser.contacts,
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
