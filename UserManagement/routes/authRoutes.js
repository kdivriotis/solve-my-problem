const express = require("express");

const { register  } = require("../controllers/auth/register");
const { login  } = require("../controllers/auth/login");
const { googleLogin  } = require("../controllers/auth/googleLogin");
const { logout } = require("../controllers/auth/logout");

const router = express.Router();

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post("/register", register);

// @route    POST api/auth/login/google
// @desc     Authenticate user with Google OAuth & get token
// @access   Public
router.post("/login/google", googleLogin);

// @route    POST api/auth/login
// @desc     Authenticate user with email/password & get token
// @access   Public
router.post("/login", login);

// @route    POST api/auth/logout
// @desc     Reset user's access cookie
// @access   Public
router.post("/logout", logout);

module.exports = router;
