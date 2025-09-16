const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const Conversation = require("../models/conversationModel");
const Notification = require("../models/notificationModel");
const UserConversation = require("../models/userConversationModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Friend = require("../models/friendModel");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
/*
Create generic handlers for:
1. Creating one document
2. Getting one document
3. Getting all documents
4. Updating one document
5. Deleting one document
*/

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    if (Model === Message) {
      if (req.body.mentions == "") {
        req.body.mentions = [];
      } else {
        req.body.mentions = req.body.mentions.split(",");
      }
    }
    let newDoc = await Model.create(req.body);
    // This will update the latest message in the conversation model

    // Updating the latest message
    if (Model === Message) {
      const updatedConvo = await Conversation.findByIdAndUpdate(
        req.body.conversation,
        {
          latestMessage: req.body.message,
        },
        { new: true }
      );
    }

    res.status(200).json({
      status: "success",
      message: "New document successfully created!",
      data: newDoc,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No document found with the id: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: "success",
      message: "Document found!",
      data: doc.toObject({ virtuals: true }),
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    let filter = {};

    if (req.baseUrl.endsWith("allConvo")) {
      filter = { users: { $in: req.user.id } };
    }

    // If the request came from user-conversation model, filter it with the user's id
    if (Model === UserConversation) {
      filter = { user: req.user._id };
    }

    if (Model == Notification) {
      filter = { receiver: req.user.id };
    }

    // If convoId is present, the user is getting a message
    if (req.params.convoId)
      Object.assign(filter, { conversation: req.params.convoId });

    features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields();

    let featureQuery = features.query;
    if (Model == Notification) {
      featureQuery = featureQuery.populate("actor").lean({ virtuals: true });
    }

    if (Model == UserConversation) {
      featureQuery = featureQuery.populate({
        path: "conversation",
        options: {
          lean: true,
        },
      });
    }

    let docs = await featureQuery;

    objectDocs = docs.map((doc) => doc.toObject({ virtuals: true }));
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all documents",
      data: objectDocs,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new AppError(`No document found with the id of: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      message: "Document successfully updated!",
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model === Conversation) {
      // Change this (user must only delete his/her record of the conversation)
      await UserConversation.deleteMany({ conversation: req.params.id });
    }

    if (Model === UserConversation) {
      const userConvo = await UserConversation.findById(req.params.id);

      if (userConvo) {
        const updatedConversation = await Conversation.findByIdAndUpdate(
          userConvo.conversation,
          { $pull: { users: req.user.id } }
        );
      }
    }

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (Model === Friend) {
      await Friend.findOneAndDelete({
        $or: [
          { user1: req.user.id, user2: req.params.id },
          { user2: req.user.id, user1: req.params.id },
        ],
      });
    }

    if (!doc) {
      return next(
        new AppError(`No document found with the id of: ${req.params.id}`, 404)
      );
    }
    res.status(204).json({
      status: "success",
      message: "Document successfully deleted!",
    });
  });
