"use strict";

var nodemailer = require("nodemailer");

var sendEmail = function sendEmail(options) {
  var transporter, mailOptions;
  return regeneratorRuntime.async(function sendEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // 1. Create transporter
          transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD
            }
          }); // 2. Define email options

          mailOptions = {
            from: "Testing USER <user@example.com>",
            to: options.email,
            subject: options.subject,
            text: options.message
          }; // 3. Send the email

          console.log("Sending the email...");
          _context.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = sendEmail;