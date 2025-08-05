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
    let newDoc = await Model.create(req.body);
    console.log("creating a new document!");
    // This will update the latest message in the conversation model

    // Updating the latest message
    console.log("the MODEL:", Model);
    if (Model === Message) {
      console.log("updating the convo...");
      console.log("conversation id:", req.body.conversation);
      console.log("the reqbody message:", req.body.message);
      const updatedConvo = await Conversation.findByIdAndUpdate(
        req.body.conversation,
        {
          latestMessage: req.body.message,
        },
        { new: true }
      );

      console.log("updated convo:", updatedConvo);
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
      data: doc,
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
      console.log("MODEL IS USERCONVERSATION");
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
      console.log("THIS IS NOTIFICATION");
      featureQuery = featureQuery.populate("actor").lean();
    }

    const docs = await featureQuery;
    console.log(req.query);
    console.log(Model == Notification);
    console.log("THE DOCS:", docs);
    if (Model === Notification) {
      return res.status(200).json({
        status: "success",
        message: "Successfully retrieved all documents",
        data: docs,
      });
    }

    const docsWithBase = await Promise.all(
      docs.map(async (doc) => {
        // doc.users = doc.users.filter(user => user._id.toString() === req.user.id);
        if (!doc.images || !Array.isArray(doc.images)) {
          console.log("THE DOC:", docs);
          return { ...doc._doc, imageBase64Array: [] }; // Handle missing images
        }

        const images64 = await Promise.all(
          doc.images.map(async (filename) => {
            const imagePath = path.join("public/img/sentImages", filename);

            try {
              const buffer = await sharp(imagePath).toBuffer();
              return `data:image/jpeg;base64,${buffer.toString("base64")}`;
            } catch (error) {
              console.error("Error processing image:", filename, error);
              return null; // Handle error gracefully
            }
          })
        );

        return { ...doc._doc, images64 };
      })
    );

    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all documents",
      data: docsWithBase,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    console.log("USER MESSAGE:", req.body.message);
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
