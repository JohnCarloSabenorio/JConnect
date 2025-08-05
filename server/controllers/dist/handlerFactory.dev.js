"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var APIFeatures = require("../utils/apiFeatures");

var Conversation = require("../models/conversationModel");

var Notification = require("../models/notificationModel");

var UserConversation = require("../models/userConversationModel");

var Message = require("../models/messageModel");

var User = require("../models/userModel");

var Friend = require("../models/friendModel");

var path = require("path");

var fs = require("fs");

var sharp = require("sharp");
/*
Create generic handlers for:
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
            console.log("creating a new document!"); // This will update the latest message in the conversation model
            // Updating the latest message

            console.log("the MODEL:", Model);

            if (!(Model === Message)) {
              _context.next = 13;
              break;
            }

            console.log("updating the convo...");
            console.log("conversation id:", req.body.conversation);
            console.log("the reqbody message:", req.body.message);
            _context.next = 11;
            return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(req.body.conversation, {
              latestMessage: req.body.message
            }, {
              "new": true
            }));

          case 11:
            updatedConvo = _context.sent;
            console.log("updated convo:", updatedConvo);

          case 13:
            res.status(200).json({
              status: "success",
              message: "New document successfully created!",
              data: newDoc
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    });
  });
};

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
};

exports.getAll = function (Model) {
  return catchAsync(function _callee5(req, res) {
    var filter, featureQuery, docs, docsWithBase;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            filter = {};

            if (req.baseUrl.endsWith("allConvo")) {
              filter = {
                users: {
                  $in: req.user.id
                }
              };
            } // If the request came from user-conversation model, filter it with the user's id


            if (Model === UserConversation) {
              console.log("MODEL IS USERCONVERSATION");
              filter = {
                user: req.user._id
              };
            }

            if (Model == Notification) {
              filter = {
                receiver: req.user.id
              };
            } // If convoId is present, the user is getting a message


            if (req.params.convoId) Object.assign(filter, {
              conversation: req.params.convoId
            });
            features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields();
            featureQuery = features.query;

            if (Model == Notification) {
              console.log("THIS IS NOTIFICATION");
              featureQuery = featureQuery.populate("actor").lean();
            }

            _context5.next = 10;
            return regeneratorRuntime.awrap(featureQuery);

          case 10:
            docs = _context5.sent;
            console.log(req.query);
            console.log(Model == Notification);
            console.log("THE DOCS:", docs);

            if (!(Model === Notification)) {
              _context5.next = 16;
              break;
            }

            return _context5.abrupt("return", res.status(200).json({
              status: "success",
              message: "Successfully retrieved all documents",
              data: docs
            }));

          case 16:
            _context5.next = 18;
            return regeneratorRuntime.awrap(Promise.all(docs.map(function _callee4(doc) {
              var images64;
              return regeneratorRuntime.async(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      if (!(!doc.images || !Array.isArray(doc.images))) {
                        _context4.next = 3;
                        break;
                      }

                      console.log("THE DOC:", docs);
                      return _context4.abrupt("return", _objectSpread({}, doc._doc, {
                        imageBase64Array: []
                      }));

                    case 3:
                      _context4.next = 5;
                      return regeneratorRuntime.awrap(Promise.all(doc.images.map(function _callee3(filename) {
                        var imagePath, buffer;
                        return regeneratorRuntime.async(function _callee3$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                imagePath = path.join("public/img/sentImages", filename);
                                _context3.prev = 1;
                                _context3.next = 4;
                                return regeneratorRuntime.awrap(sharp(imagePath).toBuffer());

                              case 4:
                                buffer = _context3.sent;
                                return _context3.abrupt("return", "data:image/jpeg;base64,".concat(buffer.toString("base64")));

                              case 8:
                                _context3.prev = 8;
                                _context3.t0 = _context3["catch"](1);
                                console.error("Error processing image:", filename, _context3.t0);
                                return _context3.abrupt("return", null);

                              case 12:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        }, null, null, [[1, 8]]);
                      })));

                    case 5:
                      images64 = _context4.sent;
                      return _context4.abrupt("return", _objectSpread({}, doc._doc, {
                        images64: images64
                      }));

                    case 7:
                    case "end":
                      return _context4.stop();
                  }
                }
              });
            })));

          case 18:
            docsWithBase = _context5.sent;
            res.status(200).json({
              status: "success",
              message: "Successfully retrieved all documents",
              data: docsWithBase
            });

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
};

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
};

exports.deleteOne = function (Model) {
  return catchAsync(function _callee7(req, res, next) {
    var doc;
    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (!(Model === Conversation)) {
              _context7.next = 3;
              break;
            }

            _context7.next = 3;
            return regeneratorRuntime.awrap(UserConversation.deleteMany({
              conversation: req.params.id
            }));

          case 3:
            _context7.next = 5;
            return regeneratorRuntime.awrap(Model.findByIdAndDelete(req.params.id));

          case 5:
            doc = _context7.sent;

            if (!(Model === Friend)) {
              _context7.next = 9;
              break;
            }

            _context7.next = 9;
            return regeneratorRuntime.awrap(Friend.findOneAndDelete({
              $or: [{
                user1: req.user.id,
                user2: req.params.id
              }, {
                user2: req.user.id,
                user1: req.params.id
              }]
            }));

          case 9:
            if (doc) {
              _context7.next = 11;
              break;
            }

            return _context7.abrupt("return", next(new AppError("No document found with the id of: ".concat(req.params.id), 404)));

          case 11:
            res.status(204).json({
              status: "success",
              message: "Document successfully deleted!"
            });

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    });
  });
};