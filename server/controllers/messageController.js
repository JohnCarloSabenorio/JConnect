const Message = require("./../models/messageModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const handlerFactory = require("./handlerFactory");
const multer = require("multer"); // For handling form data
const sharp = require("sharp"); // For saving and manipulating images
const multerstorage = multer.memoryStorage();

// For now, messages wil only accept images as file inputs
const multerFilter = (req, file, cb) => {
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
  next();
};

// Upload images
exports.uploadImages = upload.fields([{ name: "images", maxCount: 3 }]);

// Resize images (try to refcator it so that the resolution of the iamge remains the same)
exports.resizeImages = catchAsync(async (req, res, next) => {
  // Check if image exists in the request
  console.log("THE FILES:", req.file);
  if (!req.files.images) return next();

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

// GENERIC HANDLERS
exports.createMessage = handlerFactory.createOne(Message);
exports.getMessage = handlerFactory.getOne(Message);
exports.getAllMessages = handlerFactory.getAll(Message);
exports.updateMessage = handlerFactory.updateOne(Message);
exports.deleteMessage = handlerFactory.deleteOne(Message);
