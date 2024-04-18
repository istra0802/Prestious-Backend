const User = require("../models/user");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "istra0802@gmail.com", // Replace with your Gmail email
    pass: "vdya hlyq cueu vkyb", // Replace with your Gmail password
  },
});

async function sendEmail(email, subject, templateFile, data) {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "email_templates", templateFile),
      data
    );

    await transporter.sendMail({
      from: "istra0802@gmail.com", // Replace with your Gmail email
      to: email,
      subject: subject,
      html: html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

async function sendNewsletter(req, res) {
  try {
    const { email } = req.body;
    const body = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide an email address" });
    }

    const newUser = new User({
      email: body.email,
    });

    const result = await newUser.save();
    const subject = "Thank You For Subscribing";

    // Send the newsletter
    await sendEmail(email, subject, "email_template.ejs", {});

    // Update the users to mark that newsletter has been sent
    await User.updateMany({ email }, { $set: { newsletterSent: true } });

    return res.status(200).json({ message: "Newsletter sent successfully" });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getNewsletterRecipients(req, res) {
  try {
    const recipients = await User.find({ newsletterSent: true });

    // Map the recipients to include an 'id' key
    const formattedRecipients = recipients.map((user) => ({
      id: user._id, // Assuming the user model has an '_id' field
      email: user.email, // Include other fields as needed
    }));

    console.log(formattedRecipients, " ddc");
    // Set the X-Total-Count header
    res.setHeader("X-Total-Count", formattedRecipients.length);

    // Return the response with the formatted recipients
    return res.status(200).json({ data: formattedRecipients });
  } catch (error) {
    console.error("Error retrieving newsletter recipients:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createNewUser(req, res) {
  console.log("inside post req");
  try {
    const { name, email, number, subject, message } = req.body;
    if (!name) {
      return res.status(400).json({ message: "enter the first name " });
    }
    const newUser = new User({
      name,
      number,
      email,
      subject,
      message,
    });
    await newUser.save();
    return res.status(201).json({ message: "user created" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getUser(req, res) {
  try {
    const users = await User.find();
    console.log("userss", users);
    // Send the users as a JSON response
    const totalCount = await User.countDocuments(); // Get the total count of users

    // Set the X-Total-Count header in the response
    res.setHeader("X-Total-Count", totalCount);

    const formattedUsers = users.map((user) => ({
      id: user._id.toString(), // Convert ObjectId to string
      ...user.toObject(), // Include other user fields
    }));

    res.json({ data: formattedUsers });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
module.exports = {

  getUser,
  createNewUser,
  sendNewsletter,
  getNewsletterRecipients,
};
