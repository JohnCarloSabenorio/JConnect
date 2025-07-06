"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Message = require("./../models/messageModel");

var Conversation = require("../models/conversationModel");

var UserConversation = require("../models/userConversationModel");

var sharp = require("sharp"); // For saving and manipulating images


var fs = require("fs");

var path = require("path");

exports.sendMessage = function _callee3(io, socket, data) {
  var filenames, newMessage, _ref, _ref2, populatedMessage, updatedConvo, userConversation, imageBase64Array, messageObject;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Data should have the: message, sender id, and conversation id
          console.log("Sent data:", data); // Remove this in the future (Images should be sent in db not via socket)

          _context3.next = 3;
          return regeneratorRuntime.awrap(Promise.all(data.images.map(function _callee(img, idx) {
            var buffer, filename;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    console.log("THE IMAGE BRO:", img);
                    buffer = Buffer.from(img);
                    console.log("THE BUFFER:", buffer);
                    filename = "image-".concat(data.sender, "-").concat(Date.now(), "-").concat(idx, ".jpeg");
                    _context.next = 6;
                    return regeneratorRuntime.awrap(sharp(buffer).resize(800).toFormat("jpeg").jpeg({
                      quality: 70
                    }).toFile("public/img/sentImages/".concat(filename)));

                  case 6:
                    console.log("IMAGE BUFFER:", buffer);
                    return _context.abrupt("return", filename);

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 3:
          filenames = _context3.sent;
          console.log("THE ARRAY FILENAME:", filenames);
          _context3.next = 7;
          return regeneratorRuntime.awrap(Message.create({
            message: data.message || "",
            sender: data.sender,
            conversation: data.conversation,
            images: filenames,
            mentions: data.mentions
          }));

        case 7:
          newMessage = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(Promise.all([Message.findById(newMessage._id).populate("sender").populate("mentions"), // populate sender
          Conversation.findByIdAndUpdate(data.conversation, {
            latestMessage: data.latestMessage
          }, {
            "new": true
          }), UserConversation.findOne({
            user: data.sender,
            conversation: data.conversation
          })]));

        case 10:
          _ref = _context3.sent;
          _ref2 = _slicedToArray(_ref, 3);
          populatedMessage = _ref2[0];
          updatedConvo = _ref2[1];
          userConversation = _ref2[2];
          console.log("The user conversation of the sent message:", userConversation);
          _context3.next = 18;
          return regeneratorRuntime.awrap(Promise.all(populatedMessage.images.map(function _callee2(filename) {
            var imagePath, buffer;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    imagePath = path.join("public/img/sentImages", filename); // console.log("THE IMAGE PATH:", imagePath);

                    _context2.next = 3;
                    return regeneratorRuntime.awrap(sharp(imagePath).toBuffer());

                  case 3:
                    buffer = _context2.sent;
                    return _context2.abrupt("return", "data:image/jpeg;base64,".concat(buffer.toString("base64")));

                  case 5:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 18:
          imageBase64Array = _context3.sent;
          console.log("IMAGE BUFFERIST:", imageBase64Array);
          messageObject = populatedMessage.toObject();
          messageObject.images64 = imageBase64Array;
          console.log("POPPU WITH IMAGE64:", populatedMessage);
          console.log("The updated conversation:", updatedConvo);
          console.log("SENDING MESSAGE TO ROOM:", userConversation._id.toString());
          io.to(userConversation.conversation._id.toString()).emit("chat message", {
            msg: messageObject,
            convo: userConversation
          });

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.reactToMesage = function _callee4(io, socket, data) {
  var message, messageReactions, existingUserReaction, reactionIdx;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Message.findById(data.messageId));

        case 2:
          message = _context4.sent;
          console.log("the message:", message);

          if (message) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return");

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

          _context4.next = 12;
          return regeneratorRuntime.awrap(message.save());

        case 12:
          io.to(message.conversation._id.toString()).emit("message react", {
            reactions: messageReactions,
            message: message
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  });
};