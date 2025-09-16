"use strict";

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
            if (Model === Message) {
              if (req.body.mentions == "") {
                req.body.mentions = [];
              } else {
                req.body.mentions = req.body.mentions.split(",");
              }
            }

            _context.next = 3;
            return regeneratorRuntime.awrap(Model.create(req.body));

          case 3:
            newDoc = _context.sent;

            if (!(Model === Message)) {
              _context.next = 8;
              break;
            }

            _context.next = 7;
            return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(req.body.conversation, {
              latestMessage: req.body.message
            }, {
              "new": true
            }));

          case 7:
            updatedConvo = _context.sent;

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

            if (Model === User) {
              doc.profilePicture = "img/profileImages/".concat(doc.profilePicture);
              console.log("the doc:", doc);
            }

            if (doc) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", next(new AppError("No document found with the id: ".concat(req.params.id), 404)));

          case 6:
            res.status(200).json({
              status: "success",
              message: "Document found!",
              data: doc
            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
};

exports.getAll = function (Model) {
  return catchAsync(function _callee3(req, res) {
    var filter, featureQuery, docs;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
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
              featureQuery = featureQuery.populate("actor").lean();
            }

            _context3.next = 10;
            return regeneratorRuntime.awrap(featureQuery);

          case 10:
            docs = _context3.sent;

            if (Model === Message) {
              docs.forEach(function (doc) {
                doc.images = doc.images.map(function (img) {
                  return "img/sentImages/".concat(img);
                });
              });
            }

            if (Model === User) {
              docs.forEach(function (doc) {
                doc.profilePicture = "img/profileImages/".concat(doc.profilePicture);
              });
            }

            if (Model === UserConversation) {
              docs.forEach(function (doc) {
                doc.conversation.convoImage = "img/gcImages/".concat(doc.conversation.convoImage);
              });
            }

            res.status(200).json({
              status: "success",
              message: "Successfully retrieved all documents",
              data: docs
            });

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
};

exports.updateOne = function (Model) {
  return catchAsync(function _callee4(req, res) {
    var doc;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(Model.findByIdAndUpdate(req.params.id, req.body, {
              "new": true,
              runValidators: true
            }));

          case 2:
            doc = _context4.sent;

            if (doc) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt("return", next(new AppError("No document found with the id of: ".concat(req.params.id), 404)));

          case 5:
            res.status(200).json({
              status: "success",
              message: "Document successfully updated!",
              data: doc
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
};

exports.deleteOne = function (Model) {
  return catchAsync(function _callee5(req, res, next) {
    var userConvo, updatedConversation, doc;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!(Model === Conversation)) {
              _context5.next = 3;
              break;
            }

            _context5.next = 3;
            return regeneratorRuntime.awrap(UserConversation.deleteMany({
              conversation: req.params.id
            }));

          case 3:
            if (!(Model === UserConversation)) {
              _context5.next = 11;
              break;
            }

            _context5.next = 6;
            return regeneratorRuntime.awrap(UserConversation.findById(req.params.id));

          case 6:
            userConvo = _context5.sent;

            if (!userConvo) {
              _context5.next = 11;
              break;
            }

            _context5.next = 10;
            return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(userConvo.conversation, {
              $pull: {
                users: req.user.id
              }
            }));

          case 10:
            updatedConversation = _context5.sent;

          case 11:
            _context5.next = 13;
            return regeneratorRuntime.awrap(Model.findByIdAndDelete(req.params.id));

          case 13:
            doc = _context5.sent;

            if (!(Model === Friend)) {
              _context5.next = 17;
              break;
            }

            _context5.next = 17;
            return regeneratorRuntime.awrap(Friend.findOneAndDelete({
              $or: [{
                user1: req.user.id,
                user2: req.params.id
              }, {
                user2: req.user.id,
                user1: req.params.id
              }]
            }));

          case 17:
            if (doc) {
              _context5.next = 19;
              break;
            }

            return _context5.abrupt("return", next(new AppError("No document found with the id of: ".concat(req.params.id), 404)));

          case 19:
            res.status(204).json({
              status: "success",
              message: "Document successfully deleted!"
            });

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
};