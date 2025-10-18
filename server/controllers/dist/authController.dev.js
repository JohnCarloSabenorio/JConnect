"use strict";

var User = require("./../models/userModel");

var _require = require("util"),
    promisify = _require.promisify;

var catchAsync = require("./../utils/catchAsync");

var AppError = require("./../utils/appError");

var jwt = require("jsonwebtoken");

var bcrypt = require("bcrypt");

var sendEmail = require("./../utils/email");

var crypto = require("crypto"); // Generates a JWT


var signToken = function signToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

var createSignToken = function createSignToken(isRemembered, user, statusCode, res) {
  var token = signToken(user._id); // Create options for the cookie

  var cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: isRemembered ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // optional

  };

  if (isRemembered) {
    cookieOptions.expires = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // 24 Hours
    );
  } // If environment is in production, use https


  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // Stores the JWT token in a cookie

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token: token,
    message: "user successfully logged in!",
    data: user
  });
};

exports.signup = catchAsync(function _callee(req, res, next) {
  var errors, usernameRegex, passwordRegex, user, newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errors = [];
          usernameRegex = /^[a-zA-Z0-9_]+$/;
          passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          console.log("the req body:", req.body.username.length); // Check if user provided an email

          if (!req.body.email) {
            errors.push("Email must be provided.");
          } // Check if email already exists


          _context.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 7:
          user = _context.sent;
          console.log("the user:", user);

          if (user) {
            errors.push("The email you provided already exists.");
          } // Check the length of the username


          if (req.body.username.length == 0 || req.body.username.length > 20) {
            errors.push("Username must be between 0 to 20 characters.");
          } // Check if the username contains invalid characters


          if (!usernameRegex.test(req.body.username)) {
            errors.push("Username can only contain letters, numbers, and underscores.");
          } // Check if password is strong enough


          if (!passwordRegex.test(req.body.password)) {
            errors.push("Password must be 8–20 characters long and include at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.");
          } // Check if password matches


          if (!(req.body.password == req.body.passwordConfirm)) {
            errors.push("Your passwords do not match.");
          } // Sign token (This will log the user in after signing up)


          if (!(errors.length > 0)) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            status: "failed",
            message: "User registration failed",
            errors: errors
          }));

        case 18:
          _context.next = 20;
          return regeneratorRuntime.awrap(User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
          }));

        case 20:
          newUser = _context.sent;
          createSignToken(false, newUser, 200, res);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  });
});

exports.login = function _callee2(req, res, next) {
  var _req$body, email, password, isRemembered, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // 1. Check if password or email exists
          _req$body = req.body, email = _req$body.email, password = _req$body.password, isRemembered = _req$body.isRemembered;
          console.log("is user remembered:", isRemembered);

          if (!(!email || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", next(new AppError("Please provide your email and password!", 400)));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: email
          }, {
            status: "online"
          }).select("+password"));

        case 6:
          user = _context2.sent;
          _context2.t0 = !user;

          if (_context2.t0) {
            _context2.next = 12;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap(user.correctPassword(password, user.password));

        case 11:
          _context2.t0 = !_context2.sent;

        case 12:
          if (!_context2.t0) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", next(new AppError("Invalid email or password", 401)));

        case 14:
          // 3. Create Token and send response
          createSignToken(isRemembered, user, 200, res);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.logout = function _callee3(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: req.user.email
          }, {
            status: "offline"
          }));

        case 2:
          user = _context3.sent;
          res.cookie("jwt", "loggedout", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
          });
          res.status(200).json({
            status: "success"
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // Restricts the route to only those who are logged in!


exports.protect = catchAsync(function _callee4(req, res, next) {
  var token, decoded, currentUser;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // 1. Get token and check if it exists
          // Check the cookie instead of the authorization header in case it is missing (might be due to cross origin restrictions)
          if (req.headers.cookie) {
            token = req.headers.cookie.replace("jwt=", "");
          } else {
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
              token = req.headers.authorization.split(" ")[1];
            }
          } // If the JWT does not exist, then the user is not logged in


          if (token) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", next(new AppError("You are not logged in! Please log in to get access.", 401)));

        case 3:
          _context4.next = 5;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(token, process.env.JWT_SECRET));

        case 5:
          decoded = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 8:
          currentUser = _context4.sent;

          if (currentUser) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", next(new AppError("The user with this token no longer exists.", 401)));

        case 11:
          if (!currentUser.passwordChangedAfter(decoded.iat)) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", next(new AppError("The user recently changed his/her password! Please log in again.", 401)));

        case 13:
          req.user = currentUser;
          next();

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // Restricts the route according to specific roles

exports.restrictsTo = function () {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action!", 403));
    }

    next();
  };
}; // Sends email to the user if they forgot their password.


exports.forgotPassword = catchAsync(function _callee5(req, res, next) {
  var user, resetToken, resetURL, message;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context5.sent;

          if (user) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new AppError("The user with this email does not exist!", 404)));

        case 5:
          // 2. Generate token and store encrypted token in the database
          resetToken = user.createPasswordResetToken();
          _context5.next = 8;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 8:
          // 3. Compose message
          resetURL = "".concat(req.protocol, "://").concat(process.env.NODE_ENV === "production" ? process.env.LIVE_CLIENT : process.env.LOCAL_CLIENT, "/reset-password/").concat(resetToken);
          message = "\nYou are receiving this email because a password reset request was made for your account.\n\nTo reset your password, please click the link below or copy and paste it into your browser:\n".concat(resetURL, "\n\nThis link will expire in 10 minutes. If you did not request a password reset, you can safely ignore this email and no changes will be made to your account.\n\nThank you,\nThe JConnect Team\n"); // 4. send email

          _context5.prev = 10;
          _context5.next = 13;
          return regeneratorRuntime.awrap(sendEmail({
            email: user.email,
            subject: "Password Reset",
            message: message
          }));

        case 13:
          res.status(200).json({
            status: "success",
            message: "Password reset token sent to the email of the user!"
          });
          _context5.next = 23;
          break;

        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](10);
          user.passwordResetToken = undefined;
          user.tokenExpirationDate = undefined;
          _context5.next = 22;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 22:
          return _context5.abrupt("return", next(new AppError("Email failed to send! Please try again later.", 500)));

        case 23:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[10, 16]]);
}); // Resets the password of the user

exports.resetPassword = catchAsync(function _callee6(req, res, next) {
  var resetToken, user, _req$body2, newPassword, confirmNewPassword, errorMessages, regex;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log("resetting password..."); // hash token so that it matches the one in the db

          resetToken = crypto.createHash("sha256").update(req.params.token).digest("hex"); // Get user based on token

          _context6.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            passwordResetToken: resetToken
          }));

        case 4:
          user = _context6.sent;

          if (user) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", next(new AppError("User does not exist!", 404)));

        case 7:
          _req$body2 = req.body, newPassword = _req$body2.newPassword, confirmNewPassword = _req$body2.confirmNewPassword;
          errorMessages = []; // 1. Check if the password is atleast 8 characters long

          if (newPassword.length < 8) {
            errorMessages.push("Password must be at least 8 characters long.");
          } // 2. Check if the password contains atleast 1 uppercase, 1 lowercase, 1 digit, and 1 special character


          regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;

          if (!regex.test(req.body.newPassword)) {
            errorMessages.push("Password must contain atleast 1 uppercase, 1 lowercase, 1 digit, and 1 special character.");
          } // 3. Check if the password and confirm password matches


          if (newPassword != confirmNewPassword) {
            errorMessages.push("Passwords provided must match.");
          } // 4. If there is at least 1 error message, return an error


          if (!(errorMessages.length > 0)) {
            _context6.next = 15;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            status: "failed",
            message: "Failed to update user password!",
            errorMessages: errorMessages
          }));

        case 15:
          // 5. Save the password if all the conditions are met
          user.password = req.body.newPassword;
          user.passwordConfirm = req.body.confirmNewPassword;
          _context6.next = 19;
          return regeneratorRuntime.awrap(user.save());

        case 19:
          res.status(200).json({
            status: "success",
            message: "User password successfully updated!"
          });

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // Controller to check if password reset token is valid

exports.isTokenValid = catchAsync(function _callee7(req, res, next) {
  var resetToken, user;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log("validating password reset token..."); // 1. hash token so that it matches the one in the db

          resetToken = crypto.createHash("sha256").update(req.params.token).digest("hex"); // 2. Get user based on token

          _context7.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            passwordResetToken: resetToken,
            tokenExpirationDate: {
              $gt: Date.now()
            }
          }));

        case 4:
          user = _context7.sent;

          if (user) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            status: "failed",
            message: "Token is invalid!",
            isTokenValid: false
          }));

        case 7:
          res.status(200).json({
            status: "success",
            message: "Token is valid!",
            user: user,
            isTokenValid: true
          });

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.updatePassword = catchAsync(function _callee8(req, res, next) {
  var _req$body3, newPassword, confirmNewPassword, currentPassword, errorMessages, user, regex;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body3 = req.body, newPassword = _req$body3.newPassword, confirmNewPassword = _req$body3.confirmNewPassword, currentPassword = _req$body3.currentPassword;
          errorMessages = [];
          console.log("the bodehh", req.body); // 1. Get user from collection

          console.log("the req user:", req.user);
          _context8.next = 6;
          return regeneratorRuntime.awrap(User.findById(req.user._id).select("+password"));

        case 6:
          user = _context8.sent;

          if (user) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", next(new AppError("User does not exist!", 404)));

        case 9:
          _context8.next = 11;
          return regeneratorRuntime.awrap(user.correctPassword(currentPassword, user.password));

        case 11:
          if (_context8.sent) {
            _context8.next = 13;
            break;
          }

          errorMessages.push("Your password is not correct! Please try again.");

        case 13:
          // 3. Check if the password is atleast 8 characters long
          if (newPassword.length < 8) {
            errorMessages.push("Password must be at least 8 characters long.");
          } // 4. Check if the password contains atleast 1 uppercase, 1 lowercase, 1 digit, and 1 special character


          regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;

          if (!regex.test(req.body.newPassword)) {
            errorMessages.push("Password must contain atleast 1 uppercase, 1 lowercase, 1 digit, and 1 special character.");
          } // 5. Check if the password and confirm password matches


          if (newPassword != confirmNewPassword) {
            errorMessages.push("Passwords provided must match.");
          } // 6. If there is at least 1 error message, return an error


          if (!(errorMessages.length > 0)) {
            _context8.next = 19;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            status: "failed",
            message: "Failed to update user password!",
            errorMessages: errorMessages
          }));

        case 19:
          // 7. Save the password if all the conditions are met
          user.password = req.body.newPassword;
          user.passwordConfirm = req.body.confirmNewPassword;
          _context8.next = 23;
          return regeneratorRuntime.awrap(user.save());

        case 23:
          res.status(200).json({
            status: "success",
            message: "User password successfully updated!"
          });

        case 24:
        case "end":
          return _context8.stop();
      }
    }
  });
});
exports.isLoggedIn = catchAsync(function _callee9(req, res, next) {
  var _decoded, currentUser;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET));

        case 3:
          _decoded = _context9.sent;
          _context9.next = 9;
          break;

        case 6:
          _context9.prev = 6;
          _context9.t0 = _context9["catch"](0);
          next(new AppError("JWT is expired."));

        case 9:
          _context9.next = 11;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 11:
          currentUser = _context9.sent;
          currentUser.profilePicture = "img/profileImages/".concat(currentUser.profilePicture);

          if (!currentUser) {
            next(new AppError("User no longer exists!", 404));
          } // 3. Check if the user changed his/her password


          if (currentUser.passwordChangedAfter(decoded.iat)) {
            next(new AppError("User changed his/her password!", 404));
          } // 4. set req.locals.user equal to the currentUser


          res.locals.user = currentUser; // 5. go to the next middleware

          next();

        case 17:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 6]]);
});
exports.isLoggedInBool = catchAsync(function _callee10(req, res, next) {
  var decoded, currentUser;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          if (req.cookies.jwt) {
            _context10.next = 2;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            status: "failed",
            message: "JWT not present!"
          }));

        case 2:
          _context10.next = 4;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET));

        case 4:
          decoded = _context10.sent;
          _context10.next = 7;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 7:
          currentUser = _context10.sent;

          if (!currentUser) {
            next(new AppError("User no longer exists!", 404));
          } // 3. Check if the user changed his/her password


          if (currentUser.passwordChangedAfter(decoded.iat)) {
            next(new AppError("User changed his/her password!", 404));
          }

          currentUser = currentUser.toObject({
            virtuals: true
          });
          res.status(200).json({
            status: "success",
            message: "User is logged in",
            currentUser: currentUser
          });

        case 12:
        case "end":
          return _context10.stop();
      }
    }
  });
});