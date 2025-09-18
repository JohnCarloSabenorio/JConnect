const Conversation = require("../models/conversationModel");
const UserConversation = require("../models/userConversationModel");
const User = require("../models/userModel");
const handleFactory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Add a person to an existing conversation
exports.addMember = catchAsync(async (req, res, next) => {
  const convo = await Conversation.findByIdAndUpdate(
    req.params.convoId,
    {
      $addToSet: {
        users: req.params.userId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Return an error if the conversation does not exist
  if (!convo) {
    return next(new AppError("The conversation does not exist!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Successfully added a member in the conversation!",
    data: convo,
  });
});

exports.addMultipleMembers = catchAsync(async (req, res, next) => {
  let convo = await Conversation.findByIdAndUpdate(
    req.params.convoId,
    {
      $addToSet: {
        users: { $each: req.body.newUsers },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  convo = convo.toObject({ virtuals: true });

  // Return an error if the conversation does not exist
  if (!convo) {
    return next(new AppError("The conversation does not exist!", 404));
  }

  // Create new userconversation for the new members

  // Check if the conversation is a group or not
  const usersFromDB = await User.find({ _id: { $in: convo.users } }).limit(3);
  const newUsersFromDB = await User.find({ _id: { $in: req.body.newUsers } });

  let newGroupName = "";
  let usernames = [];
  try {
    for (let i = 0; i < usersFromDB.length; i++) {
      usernames.push(usersFromDB[i].username);
    }

    newGroupName = `${usernames.join(", ")},...`;
  } catch (err) {
    console.log("An error has occurred when creating a group name:", err);
  }

  // Create user-conversation
  const newGroupUserConversationData = newUsersFromDB.map((user) => {
    return {
      user: user._id,
      nickname: "",
      conversation: convo._id,
      conversationName: newGroupName,
      isGroup: true,
      status: "pending",
      role: "member",
    };
  });

  // Create new user conversation documents
  const newUserConversation = await UserConversation.create(
    newGroupUserConversationData
  );

  if (!newUserConversation) {
    return next(
      new AppError(
        "Failed to create new user conversation for the new members.",
        400
      )
    );
  }

  // Create an array containing objects of new group conversations
  res.status(200).json({
    status: "success",
    message: "Successfully added new members in the conversation",
    updatedUsers: convo.users,
  });
});

// Remove a person from an existing conversation
exports.removeMember = catchAsync(async (req, res, next) => {
  const convo = await Conversation.findByIdAndUpdate(
    req.params.convoId,
    {
      $pull: {
        users: req.params.userId,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Return an error if the conversation does not exist
  if (!convo) {
    return next(new AppError("The conversation does not exist!", 404));
  }

  res.status(204).json({
    status: "success",
    message: "Successfully added a member in the conversation!",
    data: convo,
  });
});

exports.removeMultipleMembers = catchAsync(async (req, res, next) => {});

// This checking is for a one on one conversation only
exports.checkConvoExists = catchAsync(async (req, res) => {
  // Check if conversation exists using id of two users
  const convo = await Conversation.find({
    users: { $all: [req.params.userId, req.user.id] },
    $expr: { $eq: [{ $size: "$users" }, 2] },
  });

  res.status(200).json({
    status: "success",
    data: convo,
  });
});

exports.createConversation = catchAsync(async (req, res) => {
  console.log("Creating Conversation...");
  let newConversation = await Conversation.create(req.body);

  // Populate the user data
  newConversation = await Conversation.findById(newConversation._id).populate(
    "users"
  );

  const usersFromDB = await User.find({ _id: { $in: req.body.users } });

  // Check if the conversation is a group chat or not
  if (req.body.isGroup) {
    // Create Group Name using first three usernames
    const newGroupName = req.body.conversationName
      ? req.body.conversationName
      : usersFromDB.length >= 3
      ? `${usersFromDB[0].username}, ${usersFromDB[1].username}, ${usersFromDB[2].username},...`
      : `${usersFromDB[0].username}, ${usersFromDB[1].username},...`;

    newConversation.conversationName = newGroupName;

    await newConversation.save();

    newConversation = newConversation.toObject({ virtuals: true });

    // Create an array containing objects of new group conversations
    const newGroupUserConversationData = usersFromDB.map((user) => {
      const userRole = req.user.id == user._id.toString() ? "owner" : "member";
      const userStatus =
        req.user.id == user._id.toString() ? "active" : "pending";

      return {
        user: user._id,
        nickname: "",
        conversation: newConversation._id,
        conversationName: newGroupName,
        isGroup: true,
        status: userStatus,
        role: userRole,
      };
    });

    // Create new user conversation documents
    const newUserConversations = await UserConversation.create(
      newGroupUserConversationData
    );

    // Populate the new user conversations
    let populatedUserConversations = await UserConversation.populate(
      newUserConversations,
      {
        path: "conversation",
      }
    );

    populatedUserConversations = populatedUserConversations.map((data) =>
      data.toObject({ virtuals: true })
    );
    // Find the document of the current user
    currentUserNewConvo = populatedUserConversations.find(
      (userconvo) => userconvo.user.toString() === req.user.id
    );

    return res.status(200).json({
      status: "success",
      message: "New conversation successfully created!",
      data: {
        newUserConversations: populatedUserConversations,
        currentUserNewConversation: currentUserNewConvo,
        users: newConversation.users,
      },
    });
  } else {
    const newDirectUserConversations = await UserConversation.create([
      {
        user: usersFromDB[0]._id,
        nickname: usersFromDB[1].username,
        conversation: newConversation._id,
        conversationName: usersFromDB[1].username,
      },
      {
        user: usersFromDB[1]._id,
        nickname: usersFromDB[0].username,
        conversation: newConversation._id,
        conversationName: usersFromDB[0].username,
      },
    ]);

    const currentUserNewConvo = await newDirectUserConversations
      .find((convo) => convo.user.toString() === req.user.id)
      .populate("conversation");

    return res.status(200).json({
      status: "success",
      message: "New conversation successfully created!",
      data: currentUserNewConvo.toObject({ virtuals: true }),
    });
  }
});

exports.getMutualGroupChats = catchAsync(async (req, res, next) => {
  // Get mutual conversations
  let mutualConversations = await Conversation.find({
    users: { $all: [req.user.id, req.params.userId] },
    isGroup: true,
  });

  mutualConversations = mutualConversations.map((convoData) =>
    convoData.toObject({ virtuals: true })
  );

  res.status(200).json({
    status: "success",
    message: "Successfully retrieved mutual conversations.",
    mutualConversations,
  });
});

// GENERIC HANDLERS
exports.getConversation = handleFactory.getOne(Conversation);
exports.getAllConversation = handleFactory.getAll(Conversation);
exports.updateConversation = handleFactory.updateOne(Conversation);
exports.deleteConversation = handleFactory.deleteOne(Conversation);
