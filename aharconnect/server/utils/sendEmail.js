const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      //service: process.env.EMAIL_SERVICE, // Removed this as the service is not necessary
      host: "smtp.gmail.com", // Set the host to gmail
      port: 587, // Set the port
      secure: false, // Set secure to false
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Corrected variable name
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Changed from EMAIL_FROM to EMAIL_USER
      to: email,
      subject: subject,
      text: text,
    };
    await transporter.sendMail(mailOptions);
    console.log("email sent successfully");
  } catch (error) {
      console.log("email not sent");
      console.log(error);
  }
};






module.exports = sendEmail;