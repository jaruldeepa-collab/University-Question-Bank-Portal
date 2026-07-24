const express = require("express");

const {
  registerUser,
  loginUser,
 logoutUser,
  getMe,
  adminRoute,
  facultyRoute,
  studentRoute,
} = require("../controllers/authController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);

// Role-Based Protected Routes
router.get("/admin", protect, authorize("admin"), adminRoute);
router.get("/faculty", protect, authorize("faculty"), facultyRoute);
router.get("/student", protect, authorize("student"), studentRoute);

module.exports = router;