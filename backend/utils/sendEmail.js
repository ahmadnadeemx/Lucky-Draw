const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    return await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error sending email");
  }
};

module.exports = sendEmail;
