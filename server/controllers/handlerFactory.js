const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const Conversation = require("../models/conversationModel");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
/*
Create handlers for:
1. Creating one document
2. Getting one document
3. Getting all documents
4. Updating one document
5. Deleting one document
*/

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const newDoc = await Model.create(req.body);

    // This will update the latest message in the conversation model
    // ConvoId indicates that the user is sending a message to a conversation
    if (req.params.convoId) {
      const updatedConvo = await Conversation.findByIdAndUpdate(
        req.params.convoId,
        {
          latestMessage: req.body.message,
        },
        { new: true }
      );

      console.log("UPDATED CONVERSATION LATEST:", updatedConvo);
    }

    res.status(200).json({
      status: "success",
      message: "New document successfully created!",
      data: newDoc,
    });
  });

// TESTED
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

// TESTED
exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    let filter = {};

    if (req.baseUrl.endsWith("allConvo"))
      filter = { users: { $in: req.user.id } };

    // If convoId is present, the user is getting a message
    if (req.params.convoId)
      Object.assign(filter, { conversation: req.params.convoId });

    features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields();
    const docs = await features.query;

    const docsWithBase = await Promise.all(
      docs.map(async (doc) => {
        if (!doc.images || !Array.isArray(doc.images)) {
          return { ...doc._doc, imageBase64Array: [] }; // Handle missing images
        }

        const images64 = await Promise.all(
          doc.images.map(async (filename) => {
            const imagePath = path.join("public/img/sentImages", filename);
            // console.log("THE IMAGE PATH:", imagePath);

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

// TEST 3
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

// TEST 4
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

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
