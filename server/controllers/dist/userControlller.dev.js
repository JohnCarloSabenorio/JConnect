"use strict";

var AppError = require("../utils/appError");

var User = require("./../models/userModel");

var Friend = require("./../models/friendModel.js");

var APIFeatures = require("./../utils/apiFeatures");

var catchAsync = require("./../utils/catchAsync");

var handlerFactory = require("./handlerFactory.js");

var multer = require("multer");

var sharp = require("sharp");

var multerstorage = multer.memoryStorage();

var multerFilter = function multerFilter(req, file, cb) {
  console.log("Profile Picture File:", file); // Check if the mimetype is an image

  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please try again.", 400), false);
  }
};

var upload = multer({
  storage: multerstorage,
  fileFilter: multerFilter
});
exports.uploadImage = upload.fields([{
  name: "profilePicture",
  maxCount: 1
}, {
  name: "profileBanner",
  maxCount: 1
}]);
exports.resizeImage = catchAsync(function _callee(req, res, next) {
  var filename, resizeAndUpload, _filename, _resizeAndUpload;

  return regeneratorRuntime.async(function _callee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(!req.files || !req.files.profilePicture && !req.files.profileBanner)) {
            _context3.next = 3;
            break;
          }

          console.log("there's no images uploaded!");
          return _context3.abrupt("return", next());

        case 3:
          // Create filename and push it to the body
          // Resize the image and save it to the file
          console.log("the req files:", req.files);

          if (req.files.profilePicture) {
            filename = "profile-picture-".concat(req.user.id, "-").concat(Date.now(), ".jpeg");

            resizeAndUpload = function resizeAndUpload(file) {
              return regeneratorRuntime.async(function resizeAndUpload$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return regeneratorRuntime.awrap(sharp(file).toFormat("jpeg").jpeg({
                        quality: 90
                      }).toFile("public/img/profileImages/".concat(filename)));

                    case 2:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            };

            resizeAndUpload(req.files.profilePicture[0].buffer);
            req.body.profilePicture = filename;
          } else if (req.files.profileBanner) {
            _filename = "profile-banner-".concat(req.user.id, "-").concat(Date.now(), ".jpeg");

            _resizeAndUpload = function _resizeAndUpload(file) {
              return regeneratorRuntime.async(function _resizeAndUpload$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return regeneratorRuntime.awrap(sharp(file).toFormat("jpeg").jpeg({
                        quality: 90
                      }).toFile("public/img/profileBanners/".concat(_filename)));

                    case 2:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            };

            console.log("the banner contents:", req.files);

            _resizeAndUpload(req.files.profileBanner[0].buffer);

            req.body.profileBanner = _filename;
          }

          next();

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // Update the data of the current user

exports.updateMe = catchAsync(function _callee2(req, res, next) {
  var updatedUser;
  return regeneratorRuntime.async(function _callee2$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(req.body.password || req.body.passwordConfirm)) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", next(new AppError("Please use a different endpoint for updating the password!", 400)));

        case 2:
          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 4:
          updatedUser = _context4.sent;
          updatedUser = updatedUser.toObject({
            virtuals: true
          });
          console.log("Updated:", updatedUser);
          res.status(200).json({
            status: "success",
            message: "Information successfully updated!",
            data: updatedUser
          });

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // Get the data of the current user

exports.getMe = catchAsync(function _callee3(req, res, next) {
  var currentUser;
  return regeneratorRuntime.async(function _callee3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 2:
          currentUser = _context5.sent;

          if (currentUser) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new AppError("User not found with the id of: ".concat(req.user.id), 404)));

        case 5:
          res.status(200).json({
            status: "success",
            message: "User successfully retrieved!",
            data: currentUser
          });

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // Delete the current user

exports.deleteMe = catchAsync(function _callee4(req, res, next) {
  return regeneratorRuntime.async(function _callee4$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            isActive: false
          }));

        case 2:
          res.status(204).json({
            status: "success",
            message: "Account successfully deleted!"
          });

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // Create a new user

exports.createUser = catchAsync(function _callee5(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee5$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(User.create(req.body));

        case 2:
          user = _context7.sent;
          res.status(200).json({
            status: "success",
            message: "Successfully created user",
            user: user
          });

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // GENERIC HANDLERS

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);