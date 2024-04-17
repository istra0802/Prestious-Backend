const express = require("express");

const {
  sendNewsletter,
  // getNewsletterRecipients,
  getNewsletterRecipients
} = require("../controllers/user");


const router = express.Router();

// router.route("/").get(handleGetAllUsers).post(createNewUser);

router.route("/newsletter")
.post(sendNewsletter)
.get(getNewsletterRecipients);

// router
//   .route("/:id")
//   .get(getUserById)
//   .patch(updateUserById)
//   .delete(deleteUserById);

module.exports = router;
