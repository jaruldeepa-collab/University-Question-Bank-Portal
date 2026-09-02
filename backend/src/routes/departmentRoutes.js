const express = require("express");

const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public - Get all departments
router.get("/", getDepartments);

// Admin & Faculty - Create Department
router.post("/", protect, authorize("admin", "faculty"), createDepartment);

// Admin & Faculty - Update Department
router.put("/:id", protect, authorize("admin", "faculty"), updateDepartment);

// Admin & Faculty - Delete Department
router.delete("/:id", protect, authorize("admin", "faculty"), deleteDepartment);

module.exports = router;