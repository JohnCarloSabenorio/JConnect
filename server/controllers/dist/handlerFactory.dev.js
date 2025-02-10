"use strict";

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var APIFeatures = require("../utils/apiFeatures");
/*
Create handlers for:
1. Creating one document
2. Getting one document
3. Getting all documents
4. Updating one document
5. Deleting one document
*/


exports.createOne = function (Model) {
  return catchAsync(function _callee(req, res) {
    var newDoc;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(Model.create(req.body));

          case 2:
            newDoc = _context.sent;
            res.status(200).json({
              status: "success",
              message: "New document successfully created!",
              data: newDoc
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}; // TESTED


exports.getOne = function (Model) {
  return catchAsync(function _callee2(req, res, next) {
    var doc;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(Model.findById(req.params.id));

          case 2:
            doc = _context2.sent;

            if (doc) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", next(new AppError("No document found with the id: ".concat(req.params.id), 404)));

          case 5:
            res.status(200).json({
              status: "success",
              message: "Document found!",
              data: doc
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}; // TESTED


exports.getAll = function (Model) {
  return catchAsync(function _callee3(req, res) {
    var filter, docs;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            filter = {};
            console.log("FILTER:", filter);
            features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields();
            _context3.next = 5;
            return regeneratorRuntime.awrap(features.query);

          case 5:
            docs = _context3.sent;
            res.status(200).json({
              status: "success",
              message: "Successfully retrieved all documents",
              data: docs
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
}; // TEST 3


exports.updateOne = function (Model) {
  return catchAsync(function _callee4(req, res) {
    var doc;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("USER MESSAGE:", req.body.message);
            _context4.next = 3;
            return regeneratorRuntime.awrap(Model.findByIdAndUpdate(req.params.id, req.body, {
              "new": true,
              runValidators: true
            }));

          case 3:
            doc = _context4.sent;

            if (doc) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", next(new AppError("No document found with the id of: ".concat(req.params.id), 404)));

          case 6:
            res.status(200).json({
              status: "success",
              message: "Document successfully updated!",
              data: doc
            });

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
}; // TEST 4


exports.deleteOne = function (Model) {
  return catchAsync(function _callee5(req, res, next) {
    var doc;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(Model.findByIdAndDelete(req.params.id));

          case 2:
            doc = _context5.sent;

            if (doc) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt("return", next(new AppError("No document found with the id of: ".concat(req.params.id), 404)));

          case 5:
            res.status(204).json({
              status: "success",
              message: "Document successfully deleted!"
            });

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
};