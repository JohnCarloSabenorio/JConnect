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
});
exports.reactToMessage = catchAsync(function _callee3(req, res) {
  var updatedMessage;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Message.findByIdAndUpdate(req.params.messageId, {
            $push: {
              reactions: req.body
            }
          }, {
            "new": true
          }));

        case 2:
          updatedMessage = _context3.sent;

          if (updatedMessage) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new AppError(404, "Message does not exist in the conversation.")));

        case 5:
          res.status(200).json({
            status: "success",
            message: "Successfully updated message reactions."
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.unreactToMessage = catchAsync(function _callee4(req, res) {
  var updatedMessage;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log("UNREACTING TO MESSAGE");
          _context4.next = 3;
          return regeneratorRuntime.awrap(Message.findByIdAndUpdate(req.params.messageId, {
            $pull: {
              reactions: {
                user: req.body.user
              }
            }
          }, {
            "new": true
          }));

        case 3:
          updatedMessage = _context4.sent;
          res.status(204).json({
            status: "success",
            message: "Successfully unreacted to message."
          });

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // GENERIC HANDLERS

exports.createMessage = handlerFactory.createOne(Message);
exports.getMessage = handlerFactory.getOne(Message);
exports.getAllMessages = handlerFactory.getAll(Message);
exports.updateMessage = handlerFactory.updateOne(Message);
exports.deleteMessage = handlerFactory.deleteOne(Message);