"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Message = require("./../models/messageModel");

var Conversation = require("../models/conversationModel");

var Notification = require("../models/notificationModel");

var UserConversation = require("../models/userConversationModel");

var User = require("../models/userModel");

var fs = require("fs");

var path = require("path");

exports.changeUserStatus = function _callee(io, socket, data) {
  var updatedUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("changing user status...");
          console.log("the dater:", data);
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(data.actor, {
            status: data.status
          }, {
            "new": true
          }));

        case 4:
          updatedUser = _context.sent;

          if (updatedUser) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return");

        case 7:
          console.log("after status update:", updatedUser);
          io.emit("change status", {
            updatedUser: updatedUser
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.updateNickname = function _callee2(io, socket, data) {
  var userConversations, userConvoIds, update1, update2, updateUserConvo1, updateUserConvo2, updatedUserConversation;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("update nickname data:", data);

          if (data.activeConvoIsGroup) {
            _context2.next = 20;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(UserConversation.find({
            conversation: data.conversationId
          }));

        case 4:
          userConversations = _context2.sent;
          userConvoIds = [userConversations[0]._id, userConversations[1]._id];
          console.log("user convo ids:", userConvoIds);
          update1 = {};
          update2 = {};

          if (userConvoIds[0].toString() == data.userConvoId) {
            update1.nickname = data.newNickname;
          } else {
            update1.conversationName = data.newNickname;
          }

          if (userConvoIds[1].toString() == data.userConvoId) {
            update2.nickname = data.newNickname;
          } else {
            update2.conversationName = data.newNickname;
          }

          _context2.next = 13;
          return regeneratorRuntime.awrap(UserConversation.findByIdAndUpdate(userConvoIds[0], {
            $set: update1
          }, {
            "new": true
          }).populate("conversation user"));

        case 13:
          updateUserConvo1 = _context2.sent;
          _context2.next = 16;
          return regeneratorRuntime.awrap(UserConversation.findByIdAndUpdate(userConvoIds[1], {
            $set: update2
          }, {
            "new": true
          }).populate("conversation user"));

        case 16:
          updateUserConvo2 = _context2.sent;
          // Update the user convo of the other user
          io.to(data.conversationId.toString()).emit("update nickname", {
            userConvoId: data.userConvoId,
            newNickname: data.newNickname,
            isGroup: false,
            updateUserConvo1: updateUserConvo1.toObject({
              virtuals: true
            }),
            updateUserConvo2: updateUserConvo2.toObject({
              virtuals: true
            })
          });
          _context2.next = 24;
          break;

        case 20:
          _context2.next = 22;
          return regeneratorRuntime.awrap(UserConversation.findByIdAndUpdate(data.userConvoId, {
            nickname: data.newNickname
          }, {
            "new": true,
            runValidators: true
          }));

        case 22:
          updatedUserConversation = _context2.sent;
          // Update the conversation name of the active user convo
          io.to(data.conversationId.toString()).emit("update nickname", {
            userConvoId: data.userConvoId,
            newNickname: updatedUserConversation.nickname,
            isGroup: updatedUserConversation.isGroup,
            convoId: updatedUserConversation.conversation._id
          });

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.updateConversation = function _callee3(io, socket, data) {
  var updatedConversation, resultData, newMessage, populatedMessage;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log("data data:", data.data);
          _context3.next = 3;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(data.conversationId, data.data, {
            "new": true
          }));

        case 3:
          updatedConversation = _context3.sent;

          if (updatedConversation) {
            _context3.next = 8;
            break;
          }

          console.log("No conversation has been updated!");
          console.log("Please check the data sent to the controller:", data);
          return _context3.abrupt("return");

        case 8:
          // MAKE A CREATE MESSAGE FUNCTION IF A MESSAGE IS PRESENT IN UPDATE CONVERSATION
          resultData = {
            updatedConversation: updatedConversation
          };

          if (!data.message) {
            _context3.next = 17;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(Message.create({
            message: data.message,
            conversation: data.conversationId,
            sender: data.actor,
            action: data.action
          }));

        case 12:
          newMessage = _context3.sent;
          _context3.next = 15;
          return regeneratorRuntime.awrap(newMessage.populate("sender"));

        case 15:
          populatedMessage = _context3.sent;
          resultData.messageData = populatedMessage;

        case 17:
          io.to(data.conversationId.toString()).emit("update conversation", resultData);

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.createMessage = function _callee4(io, socket, data) {
  var convo, newMessage, populatedMessage;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(data.conversationId, {
            latestMessage: data.message
          }, {
            "new": true,
            runValidators: true
          }));

        case 2:
          convo = _context4.sent;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Message.create({
            message: data.message,
            conversation: data.conversationId,
            sender: data.actor,
            action: data.action
          }));

        case 5:
          newMessage = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(newMessage.populate("sender"));

        case 8:
          populatedMessage = _context4.sent;
          console.log("the populated message here:", populatedMessage);
          io.to(data.conversationId.toString()).emit("create message", {
            userId: data.member._id ? data.member._id : data.actor,
            messageData: populatedMessage,
            conversationData: convo
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.removeMember = function _callee5(io, socket, data) {
  var convo;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Conversation.findByIdAndUpdate(data.conversationId, {
            $pull: {
              users: data.member._id
            },
            latestMessage: "".concat(data.member.username, " has been removed from the group.")
          }, {
            "new": true,
            runValidators: true
          }));

        case 2:
          convo = _context5.sent;
          _context5.next = 5;
          return regeneratorRuntime.awrap(UserConversation.findOneAndDelete({
            conversation: data.conversationId,
            user: data.member._id
          }));

        case 5:
          console.log("the freaknig convo data:", convo); // Turn the convo to an object to include virtual data

          convo = convo.toObject({
            virtuals: true
          }); // Emit remove member to the conversation

          io.to(data.conversationId.toString()).emit("remove member", {
            userId: data.member._id,
            conversationData: convo
          });

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.chatAUser = function _callee6(io, socket, data) {
  var userConversation;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(UserConversation.findOne({
            user: data.user,
            conversation: data.conversation
          }));

        case 2:
          userConversation = _context6.sent;
          userConversation = userConversation.toObject({
            virtual: true
          });

          if (userConversation) {
            _context6.next = 7;
            break;
          }

          console.log("there is no existing user conversation!");
          return _context6.abrupt("return");

        case 7:
          console.log("chatting a user data:", userConversation);
          console.log("the users:", userConversation.conversation.users);
          io.to("user_".concat(data.user)).emit("chat user", {
            userId: data.user,
            userConversation: userConversation
          });

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.inviteToGroupChat = function _callee7(io, socket, data) {
  var userConversation;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(UserConversation.findOne({
            user: data.user,
            conversation: data.conversation
          }));

        case 2:
          userConversation = _context7.sent;

          if (userConversation) {
            _context7.next = 6;
            break;
          }

          console.log("there is no existing user conversation!");
          return _context7.abrupt("return");

        case 6:
          userConversation = userConversation.toObject({
            virtuals: true
          });
          console.log("THE DATA USER:", data.user);
          io.to("user_".concat(data.user)).emit("invite groupchat", {
            userId: data.user,
            userConversation: userConversation
          });

        case 9:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.sendMessage = function _callee8(io, socket, data) {
  var newMessage, updatedUserConversation, messageObject, updatedUserConvoObject;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Message.findById(data.messageId).populate("sender").populate("mentions"));

        case 2:
          newMessage = _context8.sent;
          console.log("new message:", newMessage); // 3. Update the user conversation

          _context8.next = 6;
          return regeneratorRuntime.awrap(UserConversation.findOne({
            user: newMessage.sender._id,
            conversation: newMessage.conversation
          }));

        case 6:
          updatedUserConversation = _context8.sent;
          messageObject = _objectSpread({}, newMessage.toObject());
          updatedUserConvoObject = updatedUserConversation.toObject({
            virtuals: true
          });
          io.to(newMessage.conversation.toString()).emit("chat message", {
            msg: messageObject,
            convo: updatedUserConvoObject.conversation,
            isGroup: updatedUserConvoObject.isGroup // conversation
            // latest message

          });

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.reactToMesage = function _callee9(io, socket, data) {
  var message, messageReactions, existingUserReaction, reactionIdx, theReceiver, deleteNotif, existingNotification;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(Message.findById(data.messageId));

        case 2:
          message = _context9.sent;
          console.log("the message:", message);

          if (message) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return");

        case 6:
          // Extract the message reactions
          messageReactions = message.reactions; // Check if the user already reacted to the message

          existingUserReaction = messageReactions.find(function (reaction) {
            return reaction.user._id.toString() == data.actor.toString();
          }); // Find the index of the existing user reaction

          reactionIdx = messageReactions.findIndex(function (reaction) {
            return reaction.user._id.toString() == data.actor.toString();
          }); // console.log("the user reaction: ", existingUserReaction);
          // console.log(reactionIdx);

          if (!existingUserReaction) {
            _context9.next = 33;
            break;
          }

          if (!(existingUserReaction.unified == data.emojiUnified)) {
            _context9.next = 25;
            break;
          }

          console.log("removed the reaction"); // If it is, then remove the reaction

          messageReactions.splice(reactionIdx, 1); // This will remove the notification if the receiver is not online

          _context9.next = 15;
          return regeneratorRuntime.awrap(User.findById(data.receiver));

        case 15:
          theReceiver = _context9.sent;
          console.log("the receiver:", theReceiver); // NEED TESTING

          if (!(theReceiver.status != "online")) {
            _context9.next = 23;
            break;
          }

          console.log("THE RECEIVER IS NOT ONLINE!");
          _context9.next = 21;
          return regeneratorRuntime.awrap(Notification.findOneAndDelete({
            actor: data.actor,
            messageId: data.messageId,
            receiver: data.receiver,
            notification_type: "reaction"
          }));

        case 21:
          deleteNotif = _context9.sent;
          console.log("deleted!");

        case 23:
          _context9.next = 31;
          break;

        case 25:
          console.log("replaced the reaction"); // If not, then replace the unified emoji

          existingUserReaction.unified = data.emojiUnified;
          messageReactions[reactionIdx] = existingUserReaction; // This will update the notification if the receiver is not online
          // NEED TESTING

          _context9.next = 30;
          return regeneratorRuntime.awrap(Notification.findOneAndUpdate({
            actor: data.actor,
            messageId: data.messageId,
            conversation: data.conversation,
            receiver: data.receiver,
            notification_type: "reaction"
          }, {
            message: data.notifMessage
          }));

        case 30:
          existingNotification = _context9.sent;

        case 31:
          _context9.next = 36;
          break;

        case 33:
          // If there is no existing user reaction, create one
          console.log("added new user reaction");
          messageReactions.push({
            user: data.userId,
            unified: data.emojiUnified
          });
          message.reactions = messageReactions;

        case 36:
          _context9.next = 38;
          return regeneratorRuntime.awrap(message.save());

        case 38:
          io.to(message.conversation._id.toString()).emit("message react", {
            reactions: messageReactions,
            message: message
          });

        case 39:
        case "end":
          return _context9.stop();
      }
    }
  });
};

exports.sendNotification = function _callee10(io, socket, data) {
  var notificationData, existingNotification, userConversation, _existingNotification, newNotification;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          notificationData = {
            message: data.message,
            receiver: data.receiver,
            notification_type: data.notification_type,
            actor: data.actor // messageId: data.messageId ? data.messageId : undefined,

          };

          if (!(data.notification_type == "fr_received" || data.notification_type == "fr_accepted")) {
            _context10.next = 16;
            break;
          }

          console.log("sending friend request...");
          _context10.next = 6;
          return regeneratorRuntime.awrap(Notification.findOne({
            receiver: data.receiver,
            notification_type: data.notification_type,
            actor: data.actor
          }));

        case 6:
          existingNotification = _context10.sent;
          console.log("the existing notif:", existingNotification);

          if (!existingNotification) {
            _context10.next = 14;
            break;
          }

          existingNotification.updatedAt = Date.now();
          existingNotification.seen = false;
          _context10.next = 13;
          return regeneratorRuntime.awrap(existingNotification.save());

        case 13:
          return _context10.abrupt("return");

        case 14:
          _context10.next = 32;
          break;

        case 16:
          if (!(data.notification_type == "group_invite" || data.notification_type == "mention" || data.notification_type == "reaction")) {
            _context10.next = 32;
            break;
          }

          _context10.next = 19;
          return regeneratorRuntime.awrap(UserConversation.findOne({
            user: data.receiver,
            conversation: data.conversation
          }));

        case 19:
          userConversation = _context10.sent;

          if (!(data.notification_type == "reaction")) {
            _context10.next = 31;
            break;
          }

          _context10.next = 23;
          return regeneratorRuntime.awrap(Notification.findOne({
            receiver: data.receiver,
            notification_type: data.notification_type,
            actor: data.actor,
            messageId: data.messageId
          }));

        case 23:
          _existingNotification = _context10.sent;

          if (!_existingNotification) {
            _context10.next = 31;
            break;
          }

          _existingNotification.updatedAt = Date.now();
          _existingNotification.seen = false;
          _existingNotification.message = data.message;
          _context10.next = 30;
          return regeneratorRuntime.awrap(_existingNotification.save());

        case 30:
          return _context10.abrupt("return");

        case 31:
          notificationData["userconversation"] = userConversation._id;

        case 32:
          _context10.next = 34;
          return regeneratorRuntime.awrap(Notification.create(notificationData));

        case 34:
          newNotification = _context10.sent;
          console.log("THE USER CONVO IN NOTIF:", newNotification.userconversation);

          if (!newNotification.userconversation) {
            _context10.next = 40;
            break;
          }

          _context10.next = 39;
          return regeneratorRuntime.awrap(newNotification.populate("userconversation"));

        case 39:
          newNotification = _context10.sent;

        case 40:
          _context10.next = 42;
          return regeneratorRuntime.awrap(newNotification.populate("actor"));

        case 42:
          newNotification = _context10.sent;
          newNotification = newNotification.toObject({
            virtuals: true
          });
          console.log("new notification data:", newNotification);
          io.to("user_".concat(data.receiver)).emit("receive notification", newNotification);
          _context10.next = 51;
          break;

        case 48:
          _context10.prev = 48;
          _context10.t0 = _context10["catch"](0);
          console.log("Failed to create new notification:", _context10.t0);

        case 51:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 48]]);
};