"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  var reactionData, message, existingReaction;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log("REACTING TO MESSAGE!");
          console.log("THE MESSAGE ID:", req.params.messageId);
          console.log("THE UNIFIED EMOJI:", req.body.unified);
          reactionData = {
            unified: req.body.unified,
            user: req.user._id
          }; // find the message

          _context3.next = 6;
          return regeneratorRuntime.awrap(Message.findById(req.params.messageId));

        case 6:
          message = _context3.sent;

          if (message) {
            _context3.next = 10;
            break;
          }

          console.log("MESSAGE DOES NOT EXIST!");
          return _context3.abrupt("return", next(new AppError("Message does not exist", 400)));

        case 10:
          // find the existing reaction in the message
          existingReaction = message.reactions.filter(function (reaction) {
            return reaction.user.toString() == req.user._id;
          }); // filter out the existing reaction from the reaction array

          message.reactions = message.reactions.filter(function (reaction) {
            return reaction.user.toString() != req.user._id;
          });
          _context3.next = 14;
          return regeneratorRuntime.awrap(message.save());

        case 14:
          // If reaction exists, update it
          if (existingReaction.length > 0) {
            if (existingReaction[0].unified == req.body.unified) {} else {
              console.log("reaction already exists!", existingReaction);
              existingReaction[0].unified = req.body.unified;
              message.reactions.push(existingReaction[0]);
              console.log("UPDATED MESSAGE REACTIONS:", message.reactions);
            }
          } else {
            console.log("push a new reaction!"); // Push a new reaction if no existing reaction exists

            message.reactions.push(reactionData);
          }

          _context3.next = 17;
          return regeneratorRuntime.awrap(message.save());

        case 17:
          res.status(200).json({
            status: "success",
            message: "Successfully updated message reactions.",
            reactions: message.reactions
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.unreactToMessage = catchAsync(function _callee4(req, res) {
  var reactionData, updatedMessage;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          reactionData = {
            unified: req.body.unified,
            user: req.user.id
          };
          _context4.next = 3;
          return regeneratorRuntime.awrap(Message.findByIdAndUpdate(req.params.messageId, {
            $pull: {
              reactions: {
                user: req.user.id
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
});
exports.getTopMessageEmojis = catchAsync(function _callee5(req, res) {
  var message, reactionsCount, topReactions;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Message.findById(req.params.messageId));

        case 2:
          message = _context5.sent;

          if (message) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            status: "failed",
            message: "message does not exist!"
          }));

        case 5:
          reactionsCount = {}; // Count each reaction and sort it

          message.reactions.forEach(function (reaction) {
            if (reaction.unified in reactionsCount) reactionsCount[reaction.unified]++;else reactionsCount[reaction.unified] = 1;
          }); // fromEntries will convert the key value pair arrays back to an object

          console.log("Object entries", Object.entries(reactionsCount)); // This will get the top 3 reactions from the message

          topReactions = Object.fromEntries(Object.entries(reactionsCount).sort(function (_ref, _ref2) {
            var _ref3 = _slicedToArray(_ref, 2),
                count1 = _ref3[1];

            var _ref4 = _slicedToArray(_ref2, 2),
                count2 = _ref4[1];

            return count2 - count1;
          }).slice(0, 3)); // Return the top 3 emojis

          res.status(200).json({
            message: "Top 3 emojis of the message retrieved!",
            reactions: topReactions
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.getAllReactions = catchAsync(function _callee6(req, res) {
  var message, reactions, sortedReactions;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Message.findById(req.params.messageId));

        case 2:
          message = _context6.sent;

          if (message) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            status: "failed",
            message: "The message does not exist!"
          }));

        case 5:
          // 2. Extract the reactions of the message
          reactions = message.reactions;
          console.log("THE QUERY STRING:", req.query); // 3. Sort the users by their reaction

          sortedReactions = {};
          reactions.forEach(function (reaction) {
            var unifiedEmoji = reaction.unified;

            if (unifiedEmoji in sortedReactions) {
              sortedReactions[unifiedEmoji].push(reaction);
            } else {
              sortedReactions[unifiedEmoji] = [reaction];
            }
          });
          sortedReactions = Object.fromEntries(Object.entries(sortedReactions).sort(function (_ref5, _ref6) {
            var _ref7 = _slicedToArray(_ref5, 2),
                arr1 = _ref7[1];

            var _ref8 = _slicedToArray(_ref6, 2),
                arr2 = _ref8[1];

            return arr2.length - arr1.length;
          })); // 4. Return a nested object emoji : [users]

          return _context6.abrupt("return", res.status(200).json({
            status: "success",
            message: "Sucessfully retrieved all message reactions",
            reactions: sortedReactions
          }));

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // GENERIC HANDLERS

exports.createMessage = handlerFactory.createOne(Message);
exports.getMessage = handlerFactory.getOne(Message);
exports.getAllMessages = handlerFactory.getAll(Message);
exports.updateMessage = handlerFactory.updateOne(Message);
exports.deleteMessage = handlerFactory.deleteOne(Message);