"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var APIFeatures = require("../utils/apiFeatures");

var Conversation = require("../models/conversationModel");

var UserConversation = require("../models/userConversationModel");

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
  return catchAsync(function _callee2(req, res) {
    var newDoc, updatedConvo;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(Model.create(req.body));

          case 2:
            newDoc = _context2.sent;

            if (!req.params.convoId) {
              _context2.next = 8;
              break;
            }

            _context2.next = 6;
            return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(req.params.convoId, {
              latestMessage: req.body.message
            }, {
              "new": true
            }));

          case 6:
            updatedConvo = _context2.sent;
            console.log("UPDATED CONVERSATION LATEST:", updatedConvo);

          case 8:
            if (!(Model === Conversation)) {
              _context2.next = 15;
              break;
            }

            _context2.next = 11;
            return regeneratorRuntime.awrap(Conversation.findById(newDoc._id).populate("users"));

          case 11:
            newDoc = _context2.sent;
            console.log("USER IS CREATING A CONVERSATION: ", req.body);
            _context2.next = 15;
            return regeneratorRuntime.awrap(Promise.all(req.body.users.map(function _callee(user) {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return regeneratorRuntime.awrap(UserConversation.create({
                        user: user,
                        conversation: newDoc._id,
                        isGroup: newDoc.users.length > 2
                      }));

                    case 2:
                      return _context.abrupt("return", _context.sent);

                    case 3:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            })));

          case 15:
            res.status(200).json({
              status: "success",
              message: "New document successfully created!",
              data: newDoc
            });

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}; // TESTED


exports.getOne = function (Model) {
  return catchAsync(function _callee3(req, res, next) {
    var doc;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(Model.findById(req.params.id));

          case 2:
            doc = _context3.sent;

            if (doc) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt("return", next(new AppError("No document found with the id: ".concat(req.params.id), 404)));

          case 5:
            res.status(200).json({
              status: "success",
              message: "Document found!",
              data: doc
            });

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
}; // TESTED


exports.getAll = function (Model) {
  return catchAsync(function _callee6(req, res) {
    var filter, docs, docsWithBase;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            filter = {};
            console.log("ENDS WITH ALL CONVO:", req.baseUrl.endsWith("allConvo"));

            if (req.baseUrl.endsWith("allConvo")) {
              filter = {
                users: {
                  $in: req.user.id
                }
              };
            } // If the request came from user-conversation model, filter it with the user's id


            if (Model === UserConversation) {
              filter = {
                user: req.user.id
              };
            }

            console.log("THE QUERY:", req.query); // If convoId is present, the user is getting a message

            if (req.params.convoId) Object.assign(filter, {
              conversation: req.params.convoId
            });
            features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields();
            _context6.next = 9;
            return regeneratorRuntime.awrap(features.query);

          case 9:
            docs = _context6.sent;
            _context6.next = 12;
            return regeneratorRuntime.awrap(Promise.all(docs.map(function _callee5(doc) {
              var images64;
              return regeneratorRuntime.async(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      // doc.users = doc.users.filter(user => user._id.toString() === req.user.id);
                      console.log("THE DOC:", doc);

                      if (!(!doc.images || !Array.isArray(doc.images))) {
                        _context5.next = 3;
                        break;
                      }

                      return _context5.abrupt("return", _objectSpread({}, doc._doc, {
                        imageBase64Array: []
                      }));

                    case 3:
                      _context5.next = 5;
                      return regeneratorRuntime.awrap(Promise.all(doc.images.map(function _callee4(filename) {
                        var imagePath, buffer;
                        return regeneratorRuntime.async(function _callee4$(_context4) {
                          while (1) {
                            switch (_context4.prev = _context4.next) {
                              case 0:
                                imagePath = path.join("public/img/sentImages", filename); // console.log("THE IMAGE PATH:", imagePath);

                                _context4.prev = 1;
                                _context4.next = 4;
                                return regeneratorRuntime.awrap(sharp(imagePath).toBuffer());

                              case 4:
                                buffer = _context4.sent;
                                return _context4.abrupt("return", "data:image/jpeg;base64,".concat(buffer.toString("base64")));

                              case 8:
                                _context4.prev = 8;
                                _context4.t0 = _context4["catch"](1);
                                console.error("Error processing image:", filename, _context4.t0);
                                return _context4.abrupt("return", null);

                              case 12:
                              case "end":
                                return _context4.stop();
                            }
                          }
                        }, null, null, [[1, 8]]);
                      })));

                    case 5:
                      images64 = _context5.sent;
                      return _context5.abrupt("return", _objectSpread({}, doc._doc, {
                        images64: images64
                      }));

                    case 7:
                    case "end":
                      return _context5.stop();
                  }
                }
              });
            })));

          case 12:
            docsWithBase = _context6.sent;
            res.status(200).json({
              status: "success",
              message: "Successfully retrieved all documents",
              data: docsWithBase
            });

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    });
  });
}; // TEST 3


exports.updateOne = function (Model) {
  return catchAsync(function _callee7(req, res) {
    var doc;
    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log("USER MESSAGE:", req.body.message);
            _context7.next = 3;
            return regeneratorRuntime.awrap(Model.findByIdAndUpdate(req.params.id, req.body, {
              "new": true,
              runValidators: true
            }));

          case 3:
            doc = _context7.sent;

            if (doc) {
              _context7.next = 6;
              break;
            }

            return _context7.abrupt("return", next(new AppError("No document found with the id of: ".concat(req.params.id), 404)));

          case 6:
            res.status(200).json({
              status: "success",
              message: "Document successfully updated!",
              data: doc
            });

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    });
  });
}; // TEST 4


exports.deleteOne = function (Model) {
  return catchAsync(function _callee8(req, res, next) {
    var doc;
    return regeneratorRuntime.async(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!(Model === Conversation)) {
              _context8.next = 3;
              break;
            }

            _context8.next = 3;
            return regeneratorRuntime.awrap(UserConversation.deleteMany({
              conversation: req.params.id
            }));

          case 3:
            _context8.next = 5;
            return regeneratorRuntime.awrap(Model.findByIdAndDelete(req.params.id));

          case 5:
            doc = _context8.sent;

            if (doc) {
              _context8.next = 8;
              break;
            }

            return _context8.abrupt("return", next(new AppError("No document found with the id of: ".concat(req.params.id), 404)));

          case 8:
            res.status(204).json({
              status: "success",
              message: "Document successfully deleted!"
            });

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    });
  });
};