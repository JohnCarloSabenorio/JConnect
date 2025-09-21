const Message = require("./../models/messageModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const handlerFactory = require("./handlerFactory");
const multer = require("multer"); // For handling form data
const sharp = require("sharp"); // For saving and manipulating images
const multerstorage = multer.memoryStorage();

// For now, messages wil only accept images as file inputs
const multerFilter = (req, file, cb) => {
  console.log("FILE:", file);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please try again.", 400), false);
  }
};

const upload = multer({
  storage: multerstorage,
  fileFilter: multerFilter,
});

exports.initSenderConvo = (req, res, next) => {
  req.body.sender = req.user.id;
  req.body.conversation = req.params.convoId;
  return next();
};

// Upload images
exports.uploadImages = upload.fields([{ name: "images", maxCount: 10 }]);

// Resize images (try to refcator it so that the resolution of the iamge remains the same)
exports.resizeImages = catchAsync(async (req, res, next) => {
  // Check if image exists in the request
  if (!req.files || !req.files.images) return next();
  console.log("the files do exist!");
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (image, idx) => {
      // Rename the file
      const filename = `image-${req.user.id}-${Date.now()}-${idx}.jpeg`;

      await sharp(image.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/sentImages/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.reactToMessage = catchAsync(async (req, res) => {
  console.log("REACTING TO MESSAGE!");
  console.log("THE MESSAGE ID:", req.params.messageId);
  console.log("THE UNIFIED EMOJI:", req.body.unified);
  const reactionData = {
    unified: req.body.unified,
    user: req.user._id,
  };

  // find the message
  const message = await Message.findById(req.params.messageId);

  if (!message) {
    console.log("MESSAGE DOES NOT EXIST!");
    return next(new AppError("Message does not exist", 400));
  }
  // find the existing reaction in the message

  console.log("message reactions:", message.reactions);
  console.log("the req user id:", req.user._id);
  const existingReaction = message.reactions.filter(
    (reaction) => reaction.user._id.toString() == req.user._id.toString()
  );

  console.log("THE existing reaction:", existingReaction);

  // filter out the existing reaction from the reaction array
  message.reactions = message.reactions.filter(
    (reaction) => reaction.user._id.toString() != req.user._id.toString()
  );
  await message.save();

  // If reaction exists, update it
  if (existingReaction.length > 0) {
    if (existingReaction[0].unified == req.body.unified) {
    } else {
      console.log("reaction already exists!", existingReaction);
      existingReaction[0].unified = req.body.unified;

      message.reactions.push(existingReaction[0]);

      console.log("UPDATED MESSAGE REACTIONS:", message.reactions);
    }
  } else {
    console.log("push a new reaction!");
    // Push a new reaction if no existing reaction exists
    message.reactions.push(reactionData);
  }

  await message.save();

  res.status(200).json({
    status: "success",
    message: "Successfully updated message reactions.",
    reactions: message.reactions,
  });
});

exports.unreactToMessage = catchAsync(async (req, res) => {
  const reactionData = {
    unified: req.body.unified,
    user: req.user.id,
  };

  const updatedMessage = await Message.findByIdAndUpdate(
    req.params.messageId,
    {
      $pull: {
        reactions: {
          user: req.user.id,
        },
      },
    },
    { new: true }
  );

  res.status(204).json({
    status: "success",
    message: "Successfully unreacted to message.",
  });
});

exports.getTopMessageEmojis = catchAsync(async (req, res) => {
  // Find the message using its id
  const message = await Message.findById(req.params.messageId);

  // Return an error 404 if message does not exist

  if (!message)
    return res.status(404).json({
      status: "failed",
      message: "message does not exist!",
    });

  let reactionsCount = {};

  // Count each reaction and sort it
  message.reactions.forEach((reaction) => {
    if (reaction.unified in reactionsCount) reactionsCount[reaction.unified]++;
    else reactionsCount[reaction.unified] = 1;
  });

  // fromEntries will convert the key value pair arrays back to an object
  console.log("Object entries", Object.entries(reactionsCount));

  // This will get the top 3 reactions from the message
  let topReactions = Object.fromEntries(
    Object.entries(reactionsCount)
      .sort(([, count1], [, count2]) => count2 - count1)
      .slice(0, 3)
  );

  // Return the top 3 emojis
  res.status(200).json({
    message: "Top 3 emojis of the message retrieved!",
    reactions: topReactions,
  });
});

exports.getAllReactions = catchAsync(async (req, res) => {
  // 1. Get message
  const message = await Message.findById(req.params.messageId);

  if (!message) {
    return res.status(404).json({
      status: "failed",
      message: "The message does not exist!",
    });
  }
  // 2. Extract the reactions of the message

  const reactions = message.reactions;
  console.log("THE QUERY STRING:", req.query);

  // 3. Sort the users by their reaction
  let sortedReactions = {};

  reactions.forEach((reaction) => {
    const unifiedEmoji = reaction.unified;
    if (unifiedEmoji in sortedReactions) {
      sortedReactions[unifiedEmoji].push(reaction);
    } else {
      sortedReactions[unifiedEmoji] = [reaction];
    }
  });

  sortedReactions = Object.fromEntries(
    Object.entries(sortedReactions).sort(
      ([, arr1], [, arr2]) => arr2.length - arr1.length
    )
  );

  // 4. Return a nested object emoji : [users]
  return res.status(200).json({
    status: "success",
    message: "Sucessfully retrieved all message reactions",
    reactions: sortedReactions,
  });
});

// GENERIC HANDLERS
exports.createMessage = handlerFactory.createOne(Message);
exports.getMessage = handlerFactory.getOne(Message);
exports.getAllMessages = handlerFactory.getAll(Message);
exports.updateMessage = handlerFactory.updateOne(Message);
exports.deleteMessage = handlerFactory.deleteOne(Message);
