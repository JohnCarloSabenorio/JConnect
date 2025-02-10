"use strict";

var AppError = require("../utils/appError");

var User = require("./../models/userModel");

var Friend = require("./../models/friendModel.js");

var APIFeatures = require("./../utils/apiFeatures");

var catchAsync = require("./../utils/catchAsync");

var handlerFactory = require("./handlerFactory.js"); // USER HANDLERS


exports.updateMe = catchAsync(function _callee(req, res, next) {
  var updatedUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(req.body.password || req.body.passwordConfirm)) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next(new AppError("Please use a different endpoint for updating the password!", 400)));

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 4:
          updatedUser = _context.sent;
          console.log("Updated:", updatedUser);
          res.status(200).json({
            status: "success",
            message: "Information successfully updated!",
            data: updatedUser
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getMe = catchAsync(function _callee2(req, res, next) {
  var currentUser;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("CURRENT ID:", req.user.id);
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 3:
          currentUser = _context2.sent;

          if (currentUser) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", next(new AppError("User not found with the id of: ".concat(req.user.id), 404)));

        case 6:
          res.status(200).json({
            status: "success",
            message: "User successfully retrieved!",
            data: currentUser
          });

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.deleteMe = catchAsync(function _callee3(req, res, next) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
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
          return _context3.stop();
      }
    }
  });
});
exports.createUser = catchAsync(function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log(req.body);
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.create(req.body));

        case 3:
          res.status(200).json({
            status: "success",
            message: "Successfully created user"
          });

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // GENERIC HANDLERS

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);