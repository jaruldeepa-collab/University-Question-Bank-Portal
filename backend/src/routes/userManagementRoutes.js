const express = require("express");

const {
  getAllUsers,
  getStudents,
  getFaculty,
  approveFaculty,
  toggleUserStatus,
   deleteUser,
} = require("../controllers/userManagementController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Users
router.get(
  "/",
  protect,
  authorize("admin", "faculty"),
  getAllUsers
);

// Get Students
router.get(
  "/students",
  protect,
  authorize("admin", "faculty"),
  getStudents
);

// Get Faculty
router.get(
  "/faculty",
  protect,
  authorize("admin", "faculty"),
  getFaculty
);

// Approve Faculty
router.put(
  "/:id/approve",
  protect,
  authorize("admin", "faculty"),
  approveFaculty
);
router.put(
  "/:id/status",
  protect,
  authorize("admin", "faculty"),
  toggleUserStatus
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "faculty"),
  deleteUser
);

module.exports = router;