const express = require("express");

const {
  getUser,
  createNewUser,
  sendNewsletter,
  getNewsletterRecipients,
} = require("../controllers/user");

const router = express.Router();

router.route("/contact").post(createNewUser);

router.route("/user").get(getUser);

router.route("/newsletter").post(sendNewsletter).get(getNewsletterRecipients);

module.exports = router;
