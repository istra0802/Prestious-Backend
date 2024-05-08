const express = require("express");
const {
  getUser,
  sendMultipleEmails,
  createNewUser,
  sendNewsletter,
  getNewsletterRecipients,
  getNewUsersCount,
  authUser,
  Login,
} = require("../controllers/user");
const router = express.Router();
router.route("/contact").post(createNewUser);
router.route("/user").get(getUser);
// router.route("/login").post(Login);
router.route("/newuser").get(getNewUsersCount);
router.route("/sendemail").get(sendMultipleEmails);
router.route("/newsletter").post(sendNewsletter).get(getNewsletterRecipients);
module.exports = router;