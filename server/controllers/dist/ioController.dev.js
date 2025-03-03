"use strict";

var Message = require("./../models/messageModel");

var Conversation = require("../models/conversationModel");

var sharp = require("sharp"); // For saving and manipulating images


var fs = require("fs");

var path = require("path");

exports.sendMessage = function _callee3(io, socket, data) {
  var filenames, newMessage, populatedMessage, updatedConvo, imageBase64Array, messageObject;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
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

        case 2:
          filenames = _context3.sent;
          console.log("THE ARRAY FILENAME:", filenames);
          _context3.next = 6;
          return regeneratorRuntime.awrap(Message.create({
            message: data.message ? data.message : "",
            sender: data.sender,
            conversation: data.conversation,
            images: filenames
          }));

        case 6:
          newMessage = _context3.sent;
          _context3.next = 9;
          return regeneratorRuntime.awrap(Message.findById(newMessage._id).populate("sender"));

        case 9:
          populatedMessage = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(data.conversation, {
            latestMessage: data.message
          }, {
            "new": true
          }));

        case 12:
          updatedConvo = _context3.sent;
          _context3.next = 15;
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

        case 15:
          imageBase64Array = _context3.sent;
          console.log("IMAGE BUFFERIST:", imageBase64Array);
          messageObject = populatedMessage.toObject();
          messageObject.images64 = imageBase64Array;
          console.log("POPPU WITH IMAGE64:", populatedMessage);
          io.to(data.conversation).emit("chat message", {
            msg: messageObject,
            convo: updatedConvo
          });

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  });
};