const User = require("./../models/userModel");
const APIFeatures = require("./../utils/apiFeatures");

// USER HANDLERS
exports.getAllUsers = async (req, res) => {
  try {
    features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields();
    const users = await features.query;
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all users",
      data: users,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(200).json({
      status: "failed",
      message: "Failed to fetch all users!",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    console.log(req.body);
    const users = await User.create(req.body);
    res.status(200).json({
      status: "success",
      message: "Successfully created user",
      data: users,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(200).json({
      status: "failed",
      message: "Failed to create a user!",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.find(req.params.id);
    console.log(user);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(200).json({
      status: "failed",
      message: "Failed to get user!",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    console.log("Headers:", req.headers); // Logs headers to verify content type
    console.log("Request body:", req.body); // Logs the parsed body
    updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      message: "Successfully updated user!",
      data: updatedUser,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(400).json({
      status: "failed",
      message: "Failed to update user!",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    console.log("User deleted!");
    res.status(204).json({
      status: "success",
      message: "Successfully deleted user!",
      data: null,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(400).json({
      status: "failed",
      message: "Failed to delete user!",
    });
  }
};

// USER CONTACT HANDLERS

exports.getContacts = async (req, res) => {
  try {
    const userContacts = await User.findById(req.params.id).select("contacts");
    console.log("USER CONTACTS:", userContacts);
    res.status(200).json({
      status: "success",
      data: userContacts,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(200).json({
      status: "failed",
      message: "Failed to get user contacts!",
    });
  }
};

exports.addContact = async (req, res) => {
  try {
    updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      message: "Successfully added contact!",
      data: updatedUser.contacts,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(400).json({
      status: "failed",
      message: "Failed to add contact!",
    });
  }
};

exports.deleteContact = async (req, res) => {};
