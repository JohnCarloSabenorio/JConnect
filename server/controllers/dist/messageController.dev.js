"use strict";

var Message = require("./../models/messageModel");

var catchAsync = require("../utils/catchAsync");

var AppError = require("../utils/appError");

var handlerFactory = require("./handlerFactory");

var multer = require("multer"); // For handling form data


var sharp = require("sharp"); // For saving and manipulating images


var multerstorage = multer.memoryStorage(); // For now, messages wil only accept images as file inputs

var multerFilter = function multerFilter(req, file, cb) {
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

exports.initSenderConvo = function (req, res, next) {
  req.body.sender = req.user.id;
  req.body.conversation = req.params.convoId;
  next();
}; // Upload images


exports.uploadImages = upload.fields([{
  name: "images",
  maxCount: 3
}]); // Resize images (try to refcator it so that the resolution of the iamge remains the same)

exports.resizeImages = catchAsync(function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // Check if image exists in the request
          console.log("THE FILES:", req.file);

          if (req.files.images) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", next());

        case 3:
          req.body.images = [];
          _context2.next = 6;
          return regeneratorRuntime.awrap(Promise.all(req.files.images.map(function _callee(image, idx) {
            var filename;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    // Rename the file
                    filename = "image-".concat(req.user.id, "-").concat(Date.now(), "-").concat(idx, ".jpeg");
                    _context.next = 3;
                    return regeneratorRuntime.awrap(sharp(image.buffer).toFormat("jpeg").jpeg({
                      quality: 90
                    }).toFile("public/img/sentImages/".concat(filename)));

                  case 3:
                    req.body.images.push(filename);

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 6:
          next();

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // GENERIC HANDLERS

exports.createMessage = handlerFactory.createOne(Message);
exports.getMessage = handlerFactory.getOne(Message);
exports.getAllMessages = handlerFactory.getAll(Message);
exports.updateMessage = handlerFactory.updateOne(Message);
exports.deleteMessage = handlerFactory.deleteOne(Message);