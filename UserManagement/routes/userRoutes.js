const express = require("express");

const authorizeUser = require("../middleware/authMiddleware");

const { healthcheck } = require("../controllers/users/healthcheck");
const { getProfile } = require("../controllers/users/getProfile");
const { getUsers } = require("../controllers/users/getUsers");
const { changePassword } = require("../controllers/users/changePassword");
const { deleteUser } = require("../controllers/users/deleteUser");
const { restoreUser } = require("../controllers/users/restoreUser");
const router = express.Router();

// @route   GET /api/user/healthcheck
// @desc    Get service's health
// @access  Private
router.get("/healthcheck", authorizeUser, healthcheck);

// @route   GET /api/user/profile
// @desc    Get user's account info
// @access  Private
router.get("/profile", authorizeUser, getProfile);

// @route   DELETE /api/user/delete/:userId?
// @desc    Delete user's account
// @access  Private
router.delete("/delete/:userId?", authorizeUser, deleteUser);

// @route   POST /api/user/change-password
// @desc    Change user password
// @access  Private
router.post("/change-password", authorizeUser, changePassword);

// @route   GET /api/user/all
// @desc    Restore a deleted user
// @access  Admin
router.get("/all", authorizeUser, getUsers);

// @route   PUT /api/user/restore/:userId
// @desc    Restore a deleted user
// @access  Admin
router.put("/restore/:userId", authorizeUser, restoreUser);

module.exports = router;
