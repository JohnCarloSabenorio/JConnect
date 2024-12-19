const User = require("./../models/userModel");
const APIFeatures = require("./../utils/apiFeatures");
const apiFeatures = require("./../utils/apiFeatures");

exports.getAllUsers = async (req, res) => {
  try {
    features = new APIFeatures(User.find(), req.query).filter().sort().limitFields();
    const users = await features.query;
    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all users",
      data: users,
    });
  } catch (err) {
    res.status(200).json({
      status: "failed",
      message: `Error: ${err}`,
    });
    console.log("Failed to fetch all users!");
    console.log(`Error: ${err}`);
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
    res.status(200).json({
      status: "failed",
      message: `Error: ${err}`,
    });
    console.log("Failed to create a user!");
    console.log(`Error: ${err}`);
  }
};
