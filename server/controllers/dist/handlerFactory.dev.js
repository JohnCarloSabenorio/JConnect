"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var APIFeatures = require("../utils/apiFeatures");

var Conversation = require("../models/conversationModel");

var path = require("path");

var fs = require("fs");

var sharp = require("sharp");
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
    var newDoc, updatedConvo;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(Model.create(req.body));

          case 2:
            newDoc = _context.sent;

            if (!req.params.convoId) {
              _context.next = 8;
              break;
            }

            _context.next = 6;
            return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(req.params.convoId, {
              latestMessage: req.body.message
            }, {
              "new": true
            }));

          case 6:
            updatedConvo = _context.sent;
            console.log("UPDATED CONVERSATION LATEST:", updatedConvo);

          case 8:
            res.status(200).json({
              status: "success",
              message: "New document successfully created!",
              data: newDoc
            });

          case 9:
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
  return catchAsync(function _callee5(req, res) {
    var filter, docs, docsWithBase;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            filter = {};
            if (req.baseUrl.endsWith("allConvo")) filter = {
              users: {
                $in: req.user.id
              }
            }; // If convoId is present, the user is getting a message

            if (req.params.convoId) Object.assign(filter, {
              conversation: req.params.convoId
            });
            features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields();
            _context5.next = 6;
            return regeneratorRuntime.awrap(features.query);

          case 6:
            docs = _context5.sent;
            _context5.next = 9;
            return regeneratorRuntime.awrap(Promise.all(docs.map(function _callee4(doc) {
              var images64;
              return regeneratorRuntime.async(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      if (!(!doc.images || !Array.isArray(doc.images))) {
                        _context4.next = 2;
                        break;
                      }

                      return _context4.abrupt("return", _objectSpread({}, doc._doc, {
                        imageBase64Array: []
                      }));

                    case 2:
                      _context4.next = 4;
                      return regeneratorRuntime.awrap(Promise.all(doc.images.map(function _callee3(filename) {
                        var imagePath, buffer;
                        return regeneratorRuntime.async(function _callee3$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                imagePath = path.join("public/img/sentImages", filename);
                                console.log("THE IMAGE PATH:", imagePath);
                                _context3.prev = 2;
                                _context3.next = 5;
                                return regeneratorRuntime.awrap(sharp(imagePath).toBuffer());

                              case 5:
                                buffer = _context3.sent;
                                return _context3.abrupt("return", "data:image/jpeg;base64,".concat(buffer.toString("base64")));

                              case 9:
                                _context3.prev = 9;
                                _context3.t0 = _context3["catch"](2);
                                console.error("Error processing image:", filename, _context3.t0);
                                return _context3.abrupt("return", null);

                              case 13:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        }, null, null, [[2, 9]]);
                      })));

                    case 4:
                      images64 = _context4.sent;
                      return _context4.abrupt("return", _objectSpread({}, doc._doc, {
                        images64: images64
                      }));

                    case 6:
                    case "end":
                      return _context4.stop();
                  }
                }
              });
            })));

          case 9:
            docsWithBase = _context5.sent;
            res.status(200).json({
              status: "success",
              message: "Successfully retrieved all documents",
              data: docsWithBase
            });

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
}; // TEST 3


exports.updateOne = function (Model) {
  return catchAsync(function _callee6(req, res) {
    var doc;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("USER MESSAGE:", req.body.message);
            _context6.next = 3;
            return regeneratorRuntime.awrap(Model.findByIdAndUpdate(req.params.id, req.body, {
              "new": true,
              runValidators: true
            }));

          case 3:
            doc = _context6.sent;

            if (doc) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt("return", next(new AppError("No document found with the id of: ".concat(req.params.id), 404)));

          case 6:
            res.status(200).json({
              status: "success",
              message: "Document successfully updated!",
              data: doc
            });

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    });
  });
}; // TEST 4


exports.deleteOne = function (Model) {
  return catchAsync(function _callee7(req, res, next) {
    var doc;
    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap(Model.findByIdAndDelete(req.params.id));

          case 2:
            doc = _context7.sent;

            if (doc) {
              _context7.next = 5;
              break;
            }

            return _context7.abrupt("return", next(new AppError("No document found with the id of: ".concat(req.params.id), 404)));

          case 5:
            res.status(204).json({
              status: "success",
              message: "Document successfully deleted!"
            });

          case 6:
          case "end":
            return _context7.stop();
        }
      }
    });
  });
};