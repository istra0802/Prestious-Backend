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
      attachments: [
        {
          filename: "image-5.png",
          path: "images/image-5.png",
          cid: "uniq-mailtrap.png",
        },
        {
          filename: "image-6.png",
          path: "images/image-6.png",
          cid: "uniq-mailtrap2.png",
        },
        {
          filename: "image-7.png",
          path: "images/image-7.png",
          cid: "uniq-mailtrap3.png",
        },
        {
          filename: "image-1.png",
          path: "images/image-1.png",
          cid: "uniq-mailtrap4.png",
        },
        {
          filename: "image-2.png",
          path: "images/image-2.png",
          cid: "uniq-mailtrap5.png",
        },
        {
          filename: "image-3.png",
          path: "images/image-3.png",
          cid: "uniq-mailtrap6.png",
        },
        {
          filename: "image-4.png",
          path: "images/image-4.png",
          cid: "uniq-mailtrap7.png",
        }
      ],
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

async function sendCompanyEmail(email, subject, templateFile, data) {
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

    const companyName = "istra0802@gmail.com";
    const compnaySubject = `New subscriber have been added and the email is ${email}`;
    const result = await newUser.save();
    const subject = "Thank You For Subscribing";
  
    await sendEmail(email, subject, "email_template.ejs", {});
    await sendCompanyEmail(companyName, compnaySubject, "company_template.ejs", {});


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

    if (!email) {
      return res.status(400).json({ message: "Invalid email address" });
    }
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shrutimoradiya01@gmail.com",
        pass: "mgtx ridb fexv hidl",
      },
    });
    const mailOptions = {
      from: "shrutimoradiya01@gmail.com",
      to: "support@prestious.com",
      subject: "New Query has been arrived",
      text: `A new user has been created:\nName: ${name}\nEmail: ${email}\nNumber: ${number}\nSubject: ${subject}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getUser(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Parse the page parameter from query string
    const perPage = parseInt(req.query.perPage) || 10; // Parse the perPage parameter from query string
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    const users = await User.find({ newsletterSent: false })
      .skip(startIndex) // Skip records to implement pagination
      .limit(perPage); // Limit the number of records per page

    const totalCount = await User.countDocuments({ newsletterSent: false }); // Get the total count of users

    res.setHeader("X-Total-Count", totalCount); // Set the X-Total-Count header

    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      ...user.toObject(),
    }));

    res.json({ data: formattedUsers, page, perPage, totalCount });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getNewUsersCount(req, res) {
  try {
    const newUsersCount = await User.countDocuments({ newsletterSent: false });
    console.log("newwww", newUsersCount);
    res.json({ count: newUsersCount });
  } catch (error) {
    console.error("Error fetching new users count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// async function Login(req,res) {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });

//   if (!user) {
//     return res.status(400).json({ message: 'User not found' });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     return res.status(401).json({ message: 'Invalid password' });
//   }

//   // Generate JWT token
//   const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });

//   res.json({ token });
// }
// async function Logout(req,res){
//   res.json({ message: 'Logged out successfully' });
// }
module.exports = {
  getUser,
  createNewUser,
  sendNewsletter,
  getNewsletterRecipients,
  getNewUsersCount,
};
