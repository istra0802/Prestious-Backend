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
      return res.status(400).json({ message: "Please provide an email address" });
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


// async function getNewsletterRecipients(req, res) {
//   try {
//     // Find all users where newsletterSent is true and select only the email field
//     const recipients = await User.find({ newsletterSent: true }, { email: 1 });

//     return res.status(200).json(recipients.map(user => user.email));
//   } catch (error) {
//     console.error("Error retrieving newsletter recipients:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

async function getNewsletterRecipients(req, res) {
  try {
  
    const recipients = await User.find({newsletterSent:true});
    console.log(recipients, "Recipients with newsletterSent true");
    
    const totalCount = recipients.length;
    res.setHeader('X-Total-Count', totalCount);

    return res.status(200).json(recipients);
  } catch (error) {
    console.error("Error retrieving newsletter recipients:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
        

module.exports = {
  sendNewsletter,
  getNewsletterRecipients
};
