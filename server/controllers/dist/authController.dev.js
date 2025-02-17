"use strict";

var User = require("./../models/userModel");

var _require = require("util"),
    promisify = _require.promisify;

var catchAsync = require("./../utils/catchAsync");

var AppError = require("./../utils/appError");

var jwt = require("jsonwebtoken");

var bcrypt = require("bcrypt");

var sendEmail = require("./../utils/email");

var crypto = require("crypto");

var signToken = function signToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

var createSignToken = function createSignToken(user, statusCode, res) {
  var token = signToken(user._id); // Create options for the cookie

  var cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true // sameSite: "None",
    // domain: "localhost",
    // path: "/",

  }; // If environment is in production, use https

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // Create the cookie

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token: token,
    message: "user successfully logged in!",
    data: user
  });
};

exports.signup = catchAsync(function _callee(req, res, next) {
  var newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
          }));

        case 2:
          newUser = _context.sent;
          // Sign token
          createSignToken(newUser, 200, res);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});

exports.login = function _callee2(req, res, next) {
  var _req$body, email, password, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // 1. Check if password or email exists
          _req$body = req.body, email = _req$body.email, password = _req$body.password;

          if (!(!email || !password)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", next(new AppError("Please provide your email and password!", 400)));

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).select("+password"));

        case 5:
          user = _context2.sent;
          _context2.t0 = !user;

          if (_context2.t0) {
            _context2.next = 11;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(user.correctPassword(password, user.password));

        case 10:
          _context2.t0 = !_context2.sent;

        case 11:
          if (!_context2.t0) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", next(new AppError("Invalid email or password", 401)));

        case 13:
          // 3. Create Token and send response
          createSignToken(user, 200, res);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.logout = function (req, res) {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: "success"
  });
}; // Restricts the route to only those who are logged in!


exports.protect = catchAsync(function _callee3(req, res, next) {
  var token, decoded, currentUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // 1. Get token and check if it exists
          // Check the cookie instead of the authorization header in case it is missing (might due to cross origin)
          if (req.headers.cookie) {
            token = req.headers.cookie.replace("jwt=", "");
          } else {
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
              token = req.headers.authorization.split(" ")[1];
            }
          }

          if (token) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", next(new AppError("You are not logged in! Please log in to get access.", 401)));

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(token, process.env.JWT_SECRET));

        case 5:
          decoded = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 8:
          currentUser = _context3.sent;

          if (currentUser) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", next(new AppError("The user with this token no longer exists.", 401)));

        case 11:
          if (!currentUser.passwordChangedAfter(decoded.iat)) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", next(new AppError("The user recently changed his/her password! Please log in again.", 401)));

        case 13:
          req.user = currentUser;
          next();

        case 15:
        case "end":
          return _context3.stop();
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


exports.forgotPassword = catchAsync(function _callee4(req, res, next) {
  var user, resetToken, resetURL, message;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context4.sent;

          if (user) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new AppError("The user with this email does not exist!", 404)));

        case 5:
          // 2. Generate token and store encrypted token in the database
          resetToken = user.createPasswordResetToken();
          _context4.next = 8;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 8:
          // 3. Compose message
          resetURL = "".concat(req.protocol, "://").concat(req.get("host"), "/jconnect/v1/users/resetPassword/").concat(resetToken);
          message = "Please send a PATCH request to this url: ".concat(resetURL, ". \n if you didn't forget your password, please ignore this message."); // 4. send email

          _context4.prev = 10;
          _context4.next = 13;
          return regeneratorRuntime.awrap(sendEmail({
            email: user.email,
            subject: "Test email",
            message: message
          }));

        case 13:
          res.status(200).json({
            status: "success",
            message: "Password reset token sent to the email of the user!"
          });
          _context4.next = 23;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](10);
          user.passwordResetToken = undefined;
          user.tokenExpirationDate = undefined;
          _context4.next = 22;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 22:
          return _context4.abrupt("return", next(new AppError("Email failed to send! Please try again later.", 500)));

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[10, 16]]);
}); // Resets the password of the user

exports.resetPassword = catchAsync(function _callee5(req, res, next) {
  var resetToken, user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          // 1. hash token so that it matches the one in the db
          resetToken = crypto.createHash("sha256").update(req.params.token).digest("hex"); // 2. Get user based on token

          _context5.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            passwordResetToken: resetToken,
            tokenExpirationDate: {
              $gt: Date.now()
            }
          }));

        case 3:
          user = _context5.sent;

          if (user) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", next(new AppError("The token is invalid or expired!", 404)));

        case 6:
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          user.passwordResetToken = undefined;
          user.tokenExpirationDate = undefined;
          _context5.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          // 4. Log the user in, send JWT to the client
          res.status(200).json({
            status: "success",
            token: "token"
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.updatePassword = catchAsync(function _callee6(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user._id).select("+password"));

        case 2:
          user = _context6.sent;

          if (user) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", next(new AppError("User does not exist!", 404)));

        case 5:
          _context6.next = 7;
          return regeneratorRuntime.awrap(user.correctPassword(req.body.currentPassword, user.password));

        case 7:
          if (_context6.sent) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", next(new AppError("Your password is not correct! Please try again.", 400)));

        case 9:
          // 3. If correct, update the password
          user.password = req.body.newPassword;
          user.passwordConfirm = req.body.confirmNewPassword;
          _context6.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          createSignToken(user, 200, res);

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.isLoggedIn = catchAsync(function _callee7(req, res, next) {
  var _decoded, currentUser;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET));

        case 3:
          _decoded = _context7.sent;
          _context7.next = 9;
          break;

        case 6:
          _context7.prev = 6;
          _context7.t0 = _context7["catch"](0);
          next(new AppError("JWT is expired."));

        case 9:
          _context7.next = 11;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 11:
          currentUser = _context7.sent;

          if (!currentUser) {
            next(new AppError("User no longer exists!", 404));
          } // 3. Check if the user changed his/her password


          if (currentUser.passwordChangedAfter(decoded.iat)) {
            next(new AppError("User changed his/her password!", 404));
          } // 4. set req.locals.user equal to the currentUser


          res.locals.user = currentUser; // 5. go to the next middleware

          next();

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 6]]);
});
exports.isLoggedInBool = catchAsync(function _callee8(req, res, next) {
  var decoded, currentUser;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          if (req.cookies.jwt) {
            _context8.next = 3;
            break;
          }

          console.log("HE");
          return _context8.abrupt("return", res.status(404).json({
            status: "failed",
            message: "JWT not present!"
          }));

        case 3:
          _context8.next = 5;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET));

        case 5:
          decoded = _context8.sent;
          _context8.next = 8;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 8:
          currentUser = _context8.sent;

          if (!currentUser) {
            next(new AppError("User no longer exists!", 404));
          } // 3. Check if the user changed his/her password


          if (currentUser.passwordChangedAfter(decoded.iat)) {
            next(new AppError("User changed his/her password!", 404));
          }

          res.status(200).json({
            status: "success",
            message: "User is logged in",
            currentUser: currentUser
          });

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  });
});