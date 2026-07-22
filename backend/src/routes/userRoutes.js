const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);

module.exports = router;