const express = require("express");

const { handleGetAllUsers, getUser,updateUserById , deleteUserById, createNewUser} = require("../controllers/user")
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


module.exports = router;
