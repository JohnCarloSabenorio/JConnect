"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Message = require("./../models/messageModel");

var Conversation = require("../models/conversationModel");

var Notification = require("../models/notificationModel");

var UserConversation = require("../models/userConversationModel");

var sharp = require("sharp"); // For saving and manipulating images


var fs = require("fs");

var path = require("path");

exports.inviteToGroupChat = function _callee(io, socket, data) {
  var userConversation;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("inviting user to the group chat!");
          _context.next = 3;
          return regeneratorRuntime.awrap(UserConversation.findOne({
            user: data.user,
            conversation: data.conversation
          }));

        case 3:
          userConversation = _context.sent;
          console.log("invited user to conversation:", data.conversation);

          if (userConversation) {
            _context.next = 8;
            break;
          }

          console.log("there is no existing user conversation!");
          return _context.abrupt("return");

        case 8:
          console.log("THE DATA USER:", data.user);
          io.to("user_".concat(data.user)).emit("invite groupchat", {
            userConversation: userConversation
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.sendMessage = function _callee4(io, socket, data) {
  var newMessage, filenames, updatedUserConversation, imageBase64Array, messageObject;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Message.findById(data.messageId).populate("sender").populate("mentions"));

        case 2:
          newMessage = _context4.sent;
          console.log("new message:", newMessage); // Remove this in the future (Images should be sent in db not via socket)
          // 2. Create filenames for sent images

          if (!(data.images.length > 0)) {
            _context4.next = 13;
            break;
          }

          console.log("filenames exist!");
          _context4.next = 8;
          return regeneratorRuntime.awrap(Promise.all(data.images.map(function _callee2(img, idx) {
            var buffer, filename;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    buffer = Buffer.from(img);
                    filename = "image-".concat(newMessage.sender._id, "-").concat(Date.now(), "-").concat(idx, ".jpeg");
                    _context2.next = 4;
                    return regeneratorRuntime.awrap(sharp(buffer).resize(800).toFormat("jpeg").jpeg({
                      quality: 70
                    }).toFile("public/img/sentImages/".concat(filename)));

                  case 4:
                    return _context2.abrupt("return", filename);

                  case 5:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 8:
          filenames = _context4.sent;
          newMessage.images = filenames;
          _context4.next = 12;
          return regeneratorRuntime.awrap(newMessage.save());

        case 12:
          console.log("Array of image file names:", filenames);

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(UserConversation.findOne({
            user: newMessage.sender._id,
            conversation: newMessage.conversation
          }));

        case 15:
          updatedUserConversation = _context4.sent;
          console.log("updated user conversation:", updatedUserConversation); // 4. Convert images to base64 (This is not recommended.. Change this)

          _context4.next = 19;
          return regeneratorRuntime.awrap(Promise.all(newMessage.images.map(function _callee3(filename) {
            var imagePath, buffer;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    imagePath = path.join("public/img/sentImages", filename);
                    _context3.next = 3;
                    return regeneratorRuntime.awrap(sharp(imagePath).toBuffer());

                  case 3:
                    buffer = _context3.sent;
                    return _context3.abrupt("return", "data:image/jpeg;base64,".concat(buffer.toString("base64")));

                  case 5:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 19:
          imageBase64Array = _context4.sent;
          messageObject = _objectSpread({}, newMessage.toObject(), {
            images64: imageBase64Array
          });
          io.to(newMessage.conversation.toString()).emit("chat message", {
            msg: messageObject,
            convo: updatedUserConversation.conversation,
            isGroup: updatedUserConversation.isGroup // conversation
            // latest message

          });

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.reactToMesage = function _callee5(io, socket, data) {
  var message, messageReactions, existingUserReaction, reactionIdx;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Message.findById(data.messageId));

        case 2:
          message = _context5.sent;
          console.log("the message:", message);

          if (message) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return");

        case 6:
          // Extract the message reactions
          messageReactions = message.reactions; // Check if the user already reacted to the message

          existingUserReaction = messageReactions.find(function (reaction) {
            return reaction.user._id.toString() == data.userId.toString();
          }); // Find the index of the existing user reaction

          reactionIdx = messageReactions.findIndex(function (reaction) {
            return reaction.user._id.toString() == data.userId.toString();
          }); // console.log("the user reaction: ", existingUserReaction);
          // console.log(reactionIdx);

          if (existingUserReaction) {
            // If the user reacted to the message, check if the unified emoji is the same
            if (existingUserReaction.unified == data.emojiUnified) {
              console.log("removed the reaction"); // If it is, then remove the reaction

              messageReactions.splice(reactionIdx, 1);
            } else {
              console.log("replaced the reaction"); // If not, then replace the unified emoji

              existingUserReaction.unified = data.emojiUnified;
              messageReactions[reactionIdx] = existingUserReaction;
            }
          } else {
            // If there is no existing user reaction, create one
            console.log("added new user reaction");
            messageReactions.push({
              user: data.userId,
              unified: data.emojiUnified
            });
            message.reactions = messageReactions;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(message.save());

        case 12:
          io.to(message.conversation._id.toString()).emit("message react", {
            reactions: messageReactions,
            message: message
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.sendNotification = function _callee6(io, socket, data) {
  var notificationData, existingNotification, userConversation, _existingNotification, newNotification;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          console.log("THE SEND NOTIF DATA:", data);
          notificationData = {
            message: data.message,
            receiver: data.receiver,
            notification_type: data.notification_type,
            actor: data.actor,
            messageId: data.messageId ? data.messageId : undefined
          };

          if (!(data.notification_type == "fr_received" || data.notification_type == "fr_accepted")) {
            _context6.next = 16;
            break;
          }

          _context6.next = 6;
          return regeneratorRuntime.awrap(Notification.findOne({
            receiver: data.receiver,
            notification_type: data.notification_type,
            actor: data.actor
          }));

        case 6:
          existingNotification = _context6.sent;
          console.log("the existing notif:", existingNotification);

          if (!existingNotification) {
            _context6.next = 14;
            break;
          }

          existingNotification.updatedAt = Date.now();
          existingNotification.seen = false;
          _context6.next = 13;
          return regeneratorRuntime.awrap(existingNotification.save());

        case 13:
          return _context6.abrupt("return");

        case 14:
          _context6.next = 32;
          break;

        case 16:
          if (!(data.notification_type == "group_invite" || data.notification_type == "mention" || data.notification_type == "reaction")) {
            _context6.next = 32;
            break;
          }

          _context6.next = 19;
          return regeneratorRuntime.awrap(UserConversation.findOne({
            user: data.receiver,
            conversation: data.conversation
          }));

        case 19:
          userConversation = _context6.sent;

          if (!(data.notification_type == "reaction")) {
            _context6.next = 31;
            break;
          }

          _context6.next = 23;
          return regeneratorRuntime.awrap(Notification.findOne({
            receiver: data.receiver,
            notification_type: data.notification_type,
            actor: data.actor,
            messageId: data.messageId
          }));

        case 23:
          _existingNotification = _context6.sent;

          if (!_existingNotification) {
            _context6.next = 31;
            break;
          }

          _existingNotification.updatedAt = Date.now();
          _existingNotification.seen = false;
          _existingNotification.message = data.message;
          _context6.next = 30;
          return regeneratorRuntime.awrap(_existingNotification.save());

        case 30:
          return _context6.abrupt("return");

        case 31:
          notificationData["userconversation"] = userConversation._id;

        case 32:
          _context6.next = 34;
          return regeneratorRuntime.awrap(Notification.create(notificationData));

        case 34:
          newNotification = _context6.sent;
          console.log("THE USER CONVO IN NOTIF:", newNotification.userconversation);

          if (!newNotification.userconversation) {
            _context6.next = 40;
            break;
          }

          _context6.next = 39;
          return regeneratorRuntime.awrap(newNotification.populate("userconversation"));

        case 39:
          newNotification = _context6.sent;

        case 40:
          console.log("the new notification:", newNotification);
          io.to("user_".concat(data.receiver)).emit("receive notification", newNotification);
          _context6.next = 47;
          break;

        case 44:
          _context6.prev = 44;
          _context6.t0 = _context6["catch"](0);
          console.log("Failed to create new notification:", _context6.t0);

        case 47:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 44]]);
};