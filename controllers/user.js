const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const User = require("../models/user");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "istra0802@gmail.com", // Replace with your Gmail email
    pass: "vdya hlyq cueu vkyb", // Replace with your Gmail password
  },
});

const emailData = async() => {

}

const sendEmail = async (email, subject, templateFile, data) => {
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
    }
  };


async function sendNewsletter(req, res) {
  const body = req.body;
  if (!body || !body.email) {
    return res.status(400).json({ message: "Please provide an email address" });
  }

  const userEmail = body.email;
  const subject = "Thank You For Subscribing";

  // Specify the template file and any data you want to pass to the template
  await sendEmail(userEmail, subject, "email_template.ejs", {});

  return res.status(200).json({ message: "Newsletter sent successfully" });
}



async function handleGetAllUsers(req, res) {
  
  const allDbUsers = await User.find({});

  return res.json(allDbUsers);
}

async function getUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: " user not found " });
  }
  return res.json(user);
}

async function updateUserById(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, {
    lastName: "Changed",
  });

  if (!user) {
    return res.status(404).json({ message: " user not found " });
  }
  return res.status(200).json({ status: "success" });
}

async function deleteUserById(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: " user not found " });
  }
  return res.status(200).json({ status: "success" });
}

async function createNewUser(req, res) {
  console.log("inside post req");
  const body = req.body;
  if (!body || !body.first_name) {
    return res.status(400).json({ message: "Enter the first name" });
  }

  const newUser = new User({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  try {
    const result = await newUser.save();
    // const userEmail = result.email;
    // const subject = "Successful Registration";

    // sendEmail(userEmail, subject);

    console.log(result);
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleGetAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createNewUser,
  sendNewsletter,
  emailData
};
