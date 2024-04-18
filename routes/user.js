const express = require("express");

const { handleGetAllUsers, getUser,updateUserById , deleteUserById, createNewUser} = require("../controllers/user")
const {
  sendNewsletter,
  // getNewsletterRecipients,
  getNewsletterRecipients
} = require("../controllers/user");


const router = express.Router();


router.route("/")
.get(handleGetAllUsers)

router.route("/contact")
.post(createNewUser)

router.route("/user")
.get(getUser)

router
 .route("/:id")
 .patch(updateUserById)
 .delete(deleteUserById)

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
