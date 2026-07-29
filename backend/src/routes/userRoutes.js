const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
  adminRoute,
  facultyRoute,
  studentRoute,
} = require("../controllers/authController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Current User
router.get("/me", protect, getMe);

// Role-Based Routes
router.get("/admin", protect, authorize("admin"), adminRoute);
router.get("/faculty", protect, authorize("faculty"), facultyRoute);
router.get("/student", protect, authorize("student"), studentRoute);

module.exports = router;