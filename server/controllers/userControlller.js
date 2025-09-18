const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const Friend = require("./../models/friendModel.js");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const handlerFactory = require("./handlerFactory.js");
const multer = require("multer");
const sharp = require("sharp");
const multerstorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log("Profile Picture File:", file);
  // Check if the mimetype is an image

  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please try again.", 400), false);
  }
};

const upload = multer({ storage: multerstorage, fileFilter: multerFilter });

exports.uploadImage = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "profileBanner", maxCount: 1 },
]);

exports.resizeImage = catchAsync(async (req, res, next) => {
  // Check if there's no image in the request

  if (!req.files || (!req.files.profilePicture && !req.files.profileBanner)) {
    console.log("there's no images uploaded!");
    return next();
  }

  // Create filename and push it to the body
  // Resize the image and save it to the file

  console.log("the req files:", req.files);
  if (req.files.profilePicture) {
    const filename = `profile-picture-${req.user.id}-${Date.now()}.jpeg`;

    const resizeAndUpload = async (file) => {
      await sharp(file)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/profileImages/${filename}`);
    };

    resizeAndUpload(req.files.profilePicture[0].buffer);

    req.body.profilePicture = filename;
  } else if (req.files.profileBanner) {
    const filename = `profile-banner-${req.user.id}-${Date.now()}.jpeg`;

    const resizeAndUpload = async (file) => {
      await sharp(file)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/profileBanners/${filename}`);
    };
    console.log("the banner contents:", req.files);
    resizeAndUpload(req.files.profileBanner[0].buffer);

    req.body.profileBanner = filename;
  }

  next();
});

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

  let updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  updatedUser = updatedUser.toObject({ virtuals: true });

  console.log("Updated:", updatedUser);
  res.status(200).json({
    status: "success",
    message: "Information successfully updated!",
    data: updatedUser,
  });
});

// Get the data of the current user
exports.getMe = catchAsync(async (req, res, next) => {
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
  const user = await User.create(req.body);

  res.status(200).json({
    status: "success",
    message: "Successfully created user",
    user,
  });
});

// GENERIC HANDLERS
exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
