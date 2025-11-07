const express = require("express");
const { register, login, currentUser } = require("../controller/userContoller");
const Authentication = require("../middleware/Authentication");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", Authentication, currentUser);

module.exports = router;
